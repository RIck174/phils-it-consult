# 1. Architecture overview

## The three applications

```
phils-it-consult/
├── backend/                          Express 5 + PostgreSQL REST API      (CommonJS, npm)
├── frontend/                         Vite + React 19 storefront SPA       (ESM, npm)
└── phil-s-it-consult-landing-page/   Next.js 16 marketing page            (App Router, pnpm)
```

Each folder is an independent project with its own `package.json`, its own lockfile and its own dependency tree. There is no root `package.json`, no workspace configuration and no shared code, types or lint config between them. They are three deployables that happen to share a git repository.

## How they relate at runtime

```
        Browser
           │
           ├──────────────► frontend/  (Vite dev server :5173)
           │                    │
           │                    │ axios, baseURL hardcoded to
           │                    │ http://localhost:5000/api          ← review #28
           │                    ▼
           │                backend/  (Express :5000) ──► PostgreSQL
           │                    ▲                          (tables created at boot
           │                    │                           by src/models/index.js)
           │                    │
           │                    └── Cloudinary (image uploads)
           │                    └── Gmail SMTP via nodemailer (service-request notifications)
           │
           └──────────────► phil-s-it-consult-landing-page/  (Next :3000)
                                │
                                └── (no backend calls at all)     ← review #44
```

- **frontend → backend** is the only wired-up integration. It is one-directional HTTP/JSON, unauthenticated in practice (no token is ever attached to a request — see [03](./03-frontend.md#authcontext)).
- **landing page → backend** does not exist. Its contact form has the exact shape that `POST /api/service_requests` expects but calls `setSubmitted(true)` and discards the data.
- **backend → external**: Cloudinary (`src/utils/cloudinary.js`) for image hosting and Gmail (`src/utils/sendEmail.js`) for notifying the business of a new service request.
- There is no shared database between the landing page and the API, no SSR proxying, and no reverse proxy config in the repo.

## Request flow, storefront page load

1. `main.jsx` mounts `BrowserRouter → AuthProvider → CartProvider → App`.
2. `App.jsx` renders `Navbar`, `FloatingCart`, the route outlet and `Footer` on every route.
3. The route component and the always-mounted `Navbar` each fire their own `api.get(...)` calls on mount. There is no shared query cache, so `GET /api/products` is requested up to three times on the home page (`Products` is rendered four times with different `type` props, each instance fetching the full catalogue).
4. Responses are stored in local component state. Nothing is persisted; a refresh refetches everything and empties the cart.

## Responsibilities

### `backend/`

| Layer | Location | Responsibility |
| --- | --- | --- |
| Entry | `server.js` | dotenv, `cors()`, `express.json()`, route mounting, `createTables()`, listen |
| Schema | `src/models/index.js` | One idempotent `CREATE TABLE IF NOT EXISTS` batch run at every boot. No migration tooling |
| Data access | `src/db.js` | A single shared `pg.Pool`; every controller queries through it directly. No ORM, no repository layer |
| Routes | `src/routes/*.js` | Express routers; where auth middleware is attached |
| Controllers | `src/controllers/*.js` | Inline SQL + response shaping. Each handler has its own `try/catch` → `res.status(500)` |
| Middleware | `src/middleware/auth.js` | `authenticate` (JWT verify) and `isAdmin` (role check) |
| Utils | `src/utils/` | `cloudinary.js`, `multer.js` (memory storage), `sendEmail.js` (nodemailer/Gmail) |

There is no service layer, no validation layer, no central error handler and no 404 handler.

### `frontend/`

A single-page storefront. Routing in `App.jsx`, global state in two React contexts (`AuthContext`, `CartContext`), HTTP through one axios instance (`src/utils/api.js`), styling with Tailwind v4 via `@tailwindcss/vite`. Pages live in `src/pages/<Name>/index.jsx` (except the two service detail pages, which are files inside `src/pages/Services/`), reusable pieces in `src/components/`.

### `phil-s-it-consult-landing-page/`

A Next.js App Router project with exactly one route (`/`), which renders one client component (`components/it-services-page.tsx`). It carries shadcn/ui scaffolding (`components.json`, `components/ui/button.tsx`, `lib/utils.ts`) that nothing imports, and `@vercel/analytics` wired into the layout. `next.config.mjs` sets `typescript.ignoreBuildErrors: true`.

## Decision point: the landing page duplicates a storefront page (review #45)

**This is flagged as an unresolved decision, not as an established intent.** Nothing in the repo states which of the two is canonical.

The same "IT Services" marketing page exists twice:

| | `frontend/src/pages/Services/ItServices.jsx` | `phil-s-it-consult-landing-page/` |
| --- | --- | --- |
| Stack | React 19 + Vite + Tailwind v4 | Next 16 App Router + Tailwind v4 + shadcn |
| Icons | `react-icons/fi` | `lucide-react` |
| Route | `/services/it-services` inside the SPA | `/` of a separate deployment |
| Layout | Inherits storefront `Navbar` + `Footer` | Own header + footer |
| Contact phone | `030 397 2421` (storefront `Navbar`) | `+233 24 000 0000` (placeholder) |
| Contact email | not shown | `hello@philsitconsult.com` (placeholder) |
| Form | 6 fields, submits nowhere | same 6 fields, submits nowhere |
| Sibling links | `/services/creative-studio` (exists) | `/services/creative-studio`, `/services/workspace-transformation` (**neither route exists in the Next app**) |

Both versions carry the same copy — the features list, the "Why Phil's-IT Consult" reasons and the request form are textually identical — so they have already begun to diverge only in styling and contact details, and any future copy change has to be made twice.

Observations that bear on the decision:

- The Next app's cross-links (`/services/creative-studio`, `/services/workspace-transformation`) resolve only in the *storefront's* URL space. As deployed standalone, both are 404s. That suggests the landing page was generated as a design exploration against the storefront's sitemap rather than as a self-contained site.
- `generator: 'v0.app'` in `app/layout.tsx` indicates the landing page was produced by a design tool, which fits the "exploration" reading — but it is also a complete, well-structured page that could reasonably become the marketing front door.
- The storefront version is the only one a user can currently reach through the product's own navigation (`ServicesNav`, `ServicesSpotlightSection`, `ItServicesCard` all link to `/services/it-services`).

Three directions, with trade-offs, are set out in [07-implementation-suggestions.md](./07-implementation-suggestions.md#4-landing-page-duplicates-a-storefront-page-review-45). A decision is needed before either page is edited again.

## Known blockers

| Blocker | Effect | Detail |
| --- | --- | --- |
| Case-mismatched imports (review #27) | `cd frontend && npm run build` **fails** on Linux/CI/Docker | `App.jsx` imports `./pages/services/ItServices` and `./pages/services/CreativeStudio` (directory is `pages/Services`); `pages/Home/index.jsx` imports `../../components/SpotlightCard` (file is `components/spotlightCard.jsx`). Works only on case-insensitive macOS/Windows filesystems |
| Hardcoded API URL (review #28) | Storefront is unusable outside localhost | `src/utils/api.js` |
| No `.env.example` (review #26) | Neither app can be configured from the repo alone | See [06-setup.md](./06-setup.md) |
| No CI, no tests | Neither of the above was caught | `backend`'s `npm test` exits 1 by design |

## Deployment shape (inferred, not configured)

Nothing in the repo configures deployment — no Dockerfile, no `vercel.json`, no CI workflow, no `start` script in `backend/package.json`. A working deployment would need: the API on a Node host with a managed PostgreSQL instance, the storefront built to static assets behind a CDN with SPA fallback routing, the landing page on a Next-capable host (or folded into the storefront), and CORS on the API narrowed from `cors()` to the storefront origin.
