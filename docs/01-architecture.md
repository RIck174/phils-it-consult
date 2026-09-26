# 1. Architecture overview

## The two applications

```
phils-it-consult/
├── backend/    Express 5 + PostgreSQL REST API   (CommonJS, npm)
└── frontend/   Vite + React 19 storefront SPA    (ESM, npm)
```

Each folder is an independent project with its own `package.json`, its own lockfile and its own dependency tree. There is no root `package.json`, no workspace configuration and no shared code, types or lint config between them.

> A third folder, `phil-s-it-consult-landing-page/` (a Next.js marketing page), existed until commit `f3c7b32` and was removed as an unused experiment. **`frontend/src/pages/Services/ItServices.jsx` is the canonical IT Services page.** Noted here only because the Next version is still reachable in git history.

## How they relate at runtime

```
  Browser
     │
     └───────► frontend/  (Vite dev server :5173)
                   │
                   │ axios, baseURL hardcoded to
                   │ http://localhost:5000/api          ← review #28
                   ▼
               backend/  (Express :5000) ──► PostgreSQL
                   ▲                          (tables created at boot
                   │                           by src/models/index.js)
                   │
                   ├── Cloudinary (image uploads)
                   └── Gmail SMTP via nodemailer (service-request notifications)
```

- **frontend → backend** is the only integration. It is one-directional HTTP/JSON, and unauthenticated in practice — no token is ever attached to a request (see [03](./03-frontend.md#authcontext)).
- **backend → external**: Cloudinary (`src/utils/cloudinary.js`) for image hosting and Gmail (`src/utils/sendEmail.js`) for notifying the business of a new service request.
- There is no SSR and no API proxying through Vite — the SPA calls the API's origin directly, which is why CORS is enabled on the backend.

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

## Marketing pages live in the storefront

The IT Services and Creative Studio marketing pages are routes inside the SPA (`/services/it-services`, `/services/creative-studio`), rendered by `frontend/src/pages/Services/ItServices.jsx` and `CreativeStudio.jsx`. They inherit the storefront `Navbar` and `Footer` and are what `ServicesNav`, `ServicesSpotlightSection` and `ItServicesCard` link to. This is the canonical home for marketing content.

Two consequences follow from marketing living in a client-rendered SPA, neither of them addressed today:

- **SEO and social previews are weak.** There is no prerendering and no per-route metadata — every route serves the same empty `index.html` shell and a single `<title>`. For pages whose whole purpose is inbound leads, that is worth a deliberate decision: cheapest is prerendering the handful of static routes at build time (`vite-plugin-ssg`/`vite-plugin-prerender`) plus per-route `<head>` tags; most thorough is moving to a framework with SSR, which is a rewrite.
- **The contact forms on both service pages discard every submission** (review #43), even though `POST /api/service_requests` already stores the request and emails the business. See [07](./07-implementation-suggestions.md#5-contact-forms-discard-every-lead-review-43).

Related loose ends: `/services` itself (`pages/Services/index.jsx`) is a one-line stub, and `CreativeStudio.jsx` links to `/services/workspace-transformation`, which has no route.

## Known blockers

| Blocker | Effect | Detail |
| --- | --- | --- |
| Case-mismatched imports (review #27) | `cd frontend && npm run build` **fails** on Linux/CI/Docker | `App.jsx` imports `./pages/services/ItServices` and `./pages/services/CreativeStudio` (directory is `pages/Services`); `pages/Home/index.jsx` imports `../../components/SpotlightCard` (file is `components/spotlightCard.jsx`). Works only on case-insensitive macOS/Windows filesystems |
| Hardcoded API URL (review #28) | Storefront is unusable outside localhost | `src/utils/api.js` |
| No `.env.example` (review #26) | Neither app can be configured from the repo alone | See [06-setup.md](./06-setup.md) |
| No CI, no tests | Neither of the above was caught | `backend`'s `npm test` exits 1 by design |

## Deployment shape (inferred, not configured)

Nothing in the repo configures deployment — no Dockerfile, no CI workflow, no `start` script in `backend/package.json`. A working deployment would need: the API on a Node host with a managed PostgreSQL instance; the storefront built to static assets behind a CDN with SPA fallback routing (every unknown path must serve `index.html`, or deep links like `/shop/12` 404); the axios base URL moved to an env var; and CORS on the API narrowed from bare `cors()` to the storefront origin.
