# 7. Implementation suggestions

Approaches and trade-offs for each major gap. **No code here** — this is written so a direction can be chosen before anything is built.

A suggested ordering is at the [end](#suggested-ordering).

---

## 0. Prerequisite: unbreak the build

Nothing below can be CI-verified until `cd frontend && npm run build` succeeds on Linux. Two import statements have the wrong case (`./pages/services/…` → `./pages/Services/…`, `SpotlightCard` → `spotlightCard`). Rename the files rather than the imports if you prefer PascalCase consistently — `spotlightCard.jsx` is the only lowercase component filename — but do it with `git mv` in two steps (`git mv spotlightCard.jsx tmp.jsx && git mv tmp.jsx SpotlightCard.jsx`), because a case-only rename is a no-op on macOS. This is a few minutes of work and it is the gate on every other change.

---

## 1. Auth and Admin pages are stubs (review #32, #33)

Both pages are one-line placeholders while the backend already has working register/login and role-gated admin endpoints. The blocker is not the pages themselves — it is that **nothing attaches the JWT to requests and nothing rehydrates the session**, so even a perfect login form leaves every authenticated endpoint unreachable.

### Option A — wire up the existing JWT flow end to end

Add an axios request interceptor in `src/utils/api.js` that reads the token (from `AuthContext`, mirrored to `localStorage`) and sets the `Authorization` header; rehydrate `AuthContext` from `localStorage` on mount; build `Auth` as a single page toggling between login and register with controlled inputs; add a `ProtectedRoute` wrapper that redirects unauthenticated users to `/auth` and non-admins away from `/admin`; add a response interceptor that clears the session on a 401. Then build `Admin` as a tabbed CRUD surface over the endpoints that already exist (products, categories, services, featured slides, orders, service requests, upload).

- **Trade-off:** uses what is already built and needs no backend change beyond two small additions — a `GET /api/auth/me` (otherwise the UI must decode the JWT client-side to learn the user's name and role) and a `UNIQUE` constraint on `users.email` so duplicate registrations fail cleanly. It is also the largest single chunk of UI work in the project: an admin CRUD surface over seven resources plus an image uploader is realistically a session or two on its own.
- **Risk:** `localStorage` tokens are readable by any injected script. Acceptable for this app's threat model; the alternative is an httpOnly refresh cookie, which requires backend and CORS changes (`credentials: true`, an explicit origin allow-list rather than bare `cors()`).

### Option B — ship auth now, de-scope the admin UI

Do everything in Option A *except* the admin surface: build login/register, the interceptor, rehydration and guards, and leave `/admin` as a deliberate placeholder (or remove the route) while content is managed with SQL/Postico or a generic admin tool (Retool, Forest Admin, pgAdmin) pointed at the database.

- **Trade-off:** unblocks the customer-facing work — checkout, persistent carts, reviews all depend on auth and none of them depend on an admin UI — for a fraction of the effort. The cost is that non-technical content management stays impossible, and `POST /api/upload` (the only way to get a Cloudinary URL into `products.image_url`) keeps having no interface, so adding a product means uploading an image by hand.
- **Note either way:** the first admin must still be promoted with SQL, since `register` cannot set a role. Keep it that way — an API that can mint admins is a liability.

**Recommendation:** B first, then the admin surface incrementally, starting with products and featured slides (`NewArrivals` renders nothing until a slide exists, so that one unblocks a visibly empty section of the home page).

---

## 2. No checkout route or order flow (review #30)

`Cart`'s checkout button navigates to `/checkout`, which `App.jsx` does not define, so the page goes blank. Underneath, `POST /api/orders` accepts a client-supplied total and writes no line items, so it is not usable as-is even once a route exists (see [05](./05-data-models.md#the-broken-relationship-order_items)).

### Option A — server-authoritative checkout on top of a persisted cart

Make the cart server-side first (section 3, Option A), then rewrite `createOrder` to do everything in one transaction: read the user's `cart` joined to `products`, validate stock, compute `total_amount` from `products.price`, insert `orders`, insert an `order_items` row per line capturing the price at purchase, decrement `stock_quantity`, clear the cart, commit. The request body then carries only delivery details — never money. On the frontend add a `/checkout` route with an address/contact step, an order summary rendered from a server-returned quote, and an order-confirmation view; add `GET /api/orders/mine` for order history.

- **Trade-off:** the correct design and the only one where totals can be trusted, stock stays accurate and orders are auditable. It also closes the two IDOR holes on orders as a side effect (ownership checks come naturally once `user_id` filtering is added). Costs: transaction handling in `pg` (explicit `BEGIN`/`COMMIT`/`ROLLBACK` on a dedicated client from the pool), a schema change (`ON DELETE` policies so orders can't be orphaned), and it is blocked on auth existing.
- **Effort:** roughly a session for the backend transaction plus the checkout UI.

### Option B — quote-and-confirm without online payment

Keep the cart client-side for now and treat "checkout" as a lead: `/checkout` collects contact and delivery details, posts the cart to a new endpoint that recomputes the total server-side from product ids and quantities, stores the order plus line items with `status = 'awaiting_payment'`, and emails both customer and business (`sendEmail` already exists). Payment happens out of band — mobile money or bank transfer, reconciled by an admin flipping the status.

- **Trade-off:** matches how a lot of Ghanaian SME storefronts actually operate, avoids integrating a payment gateway, and still produces correct, auditable orders with real line items. It can also work for guests, since nothing requires a user account if contact details are captured. The cost is manual reconciliation, no automatic payment confirmation, and a second migration later if you do add Paystack/Flutterwave — though that later change is additive, since the order/line-item model is already right.

**Either way:** server-side total calculation is non-negotiable, and `cancelOrder` should set `status = 'cancelled'` rather than deleting the row — once `order_items` exists, the delete fails on the foreign key anyway.

---

## 3. Cart does not persist (review #31)

`CartContext` holds an array in React state; a refresh empties it. Meanwhile a full `/api/cart` CRUD surface exists and is called by nobody.

### Option A — localStorage-backed cart (keep it client-side)

Mirror `cartItems` to `localStorage` on change and hydrate on mount, keying by product id. Store only `{ id, quantity }` and re-fetch product details on load so prices and stock can't go stale in the browser.

- **Trade-off:** an hour of work, no backend or auth dependency, survives refreshes, and works for guests — which matters, because most visitors will not have accounts. It does not survive a device or browser change, gives no server-side view of abandoned carts, and can desync if a product is deleted or repriced (mitigated by re-fetching on load).

### Option B — server cart for signed-in users, local cart for guests

Use the existing `/api/cart` endpoints once authenticated, keep the localStorage cart for guests, and merge the guest cart into the server cart at login. Requires a `UNIQUE (user_id, product_id)` constraint so add-to-cart becomes an upsert (today `POST` blindly inserts, duplicating rows), ownership filters on `PUT`/`DELETE` to close the IDOR, and a `GET /api/cart` that joins `products` so one request returns renderable lines instead of bare ids.

- **Trade-off:** cross-device carts, abandoned-cart visibility, and it is the natural input to the server-authoritative checkout in section 2 Option A. Costs: blocked on auth; merge semantics need a decision (sum quantities or take the max — summing surprises users who added the same item on two devices); and every cart mutation becomes a network round trip, so the UI needs optimistic updates to stay responsive.

**Recommendation:** A now — it is cheap, independent of everything else, and fixes the most visible everyday bug. Then B once auth lands, keeping the local cart as the guest path rather than replacing it.

---

## 4. Marketing pages have no SEO story (follows from the landing-page decision)

The duplicate Next.js landing page was deleted in `f3c7b32` and `frontend/src/pages/Services/ItServices.jsx` is now canonical — that decision is settled. What it leaves open is the reason the Next version existed: the marketing pages now live in a client-rendered SPA with no prerendering and a single global `<title>`, so crawlers and link unfurlers see an empty shell on the pages whose entire job is inbound leads.

### Option A — prerender the static routes, stay on Vite

Add build-time prerendering for the handful of content routes (`/`, `/services/it-services`, `/services/creative-studio`) and per-route `<head>` tags via `react-helmet-async` or equivalent, so each ships real HTML and its own title/description/OG tags.

- **Trade-off:** a day of work, no change to the architecture, and it covers the marketing pages properly. It does not help `/shop/:id`, whose content is per-product and comes from the API — those pages stay invisible to crawlers unless you prerender at build time from the catalogue, which then goes stale between deploys.

### Option B — move to a framework with SSR later

Revisit only if organic search on *product* pages becomes a business requirement.

- **Trade-off:** properly solves catalogue SEO and image optimisation, but it is a rewrite of every page and both contexts. Far too large to take on before auth, checkout and cart work. Listed so the option is on the record, not recommended now.

**Recommendation:** A if marketing SEO matters at all in the next few months; otherwise do nothing and revisit. Separately, reconcile contact details across the site — `Navbar` shows `030 397 2421` and the service pages carry placeholders (`+233 24 000 0000`, `hello@philsitconsult.com`) inherited from the design draft, so the site currently tells customers two different things.

---

## 5. Contact forms discard every lead (review #43)

Both service-page forms — `ItServices.jsx` and `CreativeStudio.jsx` — collect exactly the six fields `POST /api/service_requests` expects and throw them away. This is the highest business impact per hour of work in the whole list: the backend, the table and the notification email all already exist.

- **Approach:** make the inputs controlled, POST to `/api/service_requests` (camelCase body: `companyName`, `contactPerson`, `email`, `phone`, `serviceType`, `message`), and only then show the thank-you state; on failure show an error and keep the entered values.
- **Harden the endpoint at the same time:** it is a public, unauthenticated write with no validation and no rate limit. Add field validation, a basic rate limit (`express-rate-limit`), and escape the values interpolated into the notification email's HTML (review #11). Also decide what a failed email send should do — today the row is committed and the client still gets a 500, so the business sees a "failure" for a request that was in fact stored.

---

## 6. Other gaps worth scheduling

| Gap | Approach | Note |
| --- | --- | --- |
| Upload route is effectively public (#1, #2, #3) | Reorder to `authenticate, isAdmin, upload.single("image")`; add `limits: { fileSize: 5MB }` and a `fileFilter` for image MIME types; guard `req.file` | Smallest high-severity fix in the repo — minutes, not hours |
| `authenticate` 500s on a missing header (#4) | Guard `req.headers.authorization` before `.split()` and return 401 | Do it with the upload fix |
| Cart/order IDOR (#5, #6) | Add `AND user_id = $n` to every by-id cart/order query; keep the 404/403 response indistinguishable | Falls out of sections 2 and 3 |
| Client-supplied order totals (#7) | Compute server-side from `products.price` | Section 2 |
| No rate limiting, open CORS (#12, #13) | `express-rate-limit` on `/api/auth/login` and `/api/service_requests`; `helmet`; CORS narrowed to known origins via env | An afternoon |
| Internal errors leaked in responses (#10) | Strip `err: error.message` from client responses; log server-side instead | Mechanical |
| No validation anywhere | One layer (zod/express-validator) applied at the route boundary | Do it once, apply as endpoints are touched |
| No migrations | Adopt node-pg-migrate or Knex; convert the current `createTables` into an initial migration | Required before any schema change reaches an existing database |
| `reviews` orphan table | Controller + routes + a `review_count`/`avg_rating` aggregate on product reads | Would make `Products.jsx`'s existing `(0)` rating real |
| Missing `products.old_price` | Add the column, or drop the discount UI | Decide which — the UI is currently dead either way |
| `/services/workspace-transformation` | Build the page, or remove the link | Dead link in `CreativeStudio.jsx` |
| Hardcoded service names in `ServicesNav` (#47) | Add a `slug` column to `services` and route on it | Removes a silent failure when a row is renamed |
| Hardcoded API URL (#28) | `import.meta.env.VITE_API_URL` with a localhost fallback | Prerequisite for any deployment |
| No `.env.example` (#26) | Commit one for `backend/` from the table in [06](./06-setup.md) | Ten minutes, high value for onboarding |
| Dead components (`HeroTextCard`, `ItServicesCard`, `PcShowcase`, `Tabs`, `Categories`, `Reveal`) | Delete, or wire them in | `Categories` is the only consumer of `GET /api/categories/:id/brands`; `PcShowcase` the only consumer of `public/videos/` |
| No tests, no CI | GitHub Actions running `npm run lint` + `npm run build` on the frontend and a supertest suite on the backend | Blocked on the build fix in section 0 |
| Footer placeholders (#42) | Real links and brand name | "X Example" is visible on every page |

---

## Suggested ordering

1. **Section 0** — fix the two case-mismatched imports so the frontend builds. Blocks CI and every deploy.
2. **Upload reorder + multer limits + the `authenticate` header guard** (section 6, first two rows). Minutes of work, highest severity.
3. **Section 5** — wire the contact forms to the endpoint that already exists. Highest business value per hour.
4. **Section 3 Option A** — localStorage cart. Cheap, independent, fixes the most visible everyday bug.
5. **Section 4 Option A** — prerendering and per-route metadata, if marketing SEO matters; otherwise skip.
6. **Section 1 Option B** — auth (login/register, interceptor, rehydration, guards) without the admin surface.
7. **Section 2** — checkout with server-computed totals and real `order_items`, plus the ownership fixes.
8. **Section 1 Option A remainder** — the admin surface, products and featured slides first.
9. Hardening and hygiene from the section 6 table: validation, rate limiting, helmet, CORS, migrations, `.env.example`, CI.
