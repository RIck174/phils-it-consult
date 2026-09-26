# 3. Frontend pages and components

Covers every page, component and context in `frontend/` (Vite + React 19 SPA). Import/endpoint trees for each file live in [04-dependency-map.md](./04-dependency-map.md); this document describes purpose, props and state.

## Application shell

### `src/main.jsx`

Mounts `StrictMode → BrowserRouter → AuthProvider → CartProvider → App`. No props, no state. `StrictMode` double-invokes effects in development, so every `api.get` on mount fires twice locally.

### `src/App.jsx`

Renders `Navbar` and `FloatingCart` above the route outlet and `Footer` below, so all three appear on every page. No props, no state.

| Path | Element | Notes |
| --- | --- | --- |
| `/` | `Home` | |
| `/auth` | `Auth` | stub |
| `/admin` | `Admin` | stub, **unguarded** — no role check anywhere |
| `/services` | `Services` | stub |
| `/shop` | `Shop` | reads `?q=` and `?cat=` |
| `/services/it-services` | `ItServices` | |
| `/services/creative-studio` | `CreativeStudio` | |
| `/shop/:id` | `ProductDetail` | |
| `/cart` | `Cart` | |
| — | — | **MISSING `/checkout`** — `Cart` navigates there (review #30) |
| — | — | **MISSING catch-all `*`** — unknown URLs render the shell with a blank body |

Imports `./pages/services/ItServices` and `./pages/services/CreativeStudio` with a lowercase `services`; the directory is `Services`. **This breaks `npm run build` on case-sensitive filesystems** (review #27).

## Contexts

### `AuthContext`

`src/context/AuthContext.jsx`. Props: `children`. State: `user` (object or `null`), `token` (string or `null`).

| Value | Behaviour |
| --- | --- |
| `login(userData, tokenData)` | sets both state values and writes `localStorage.token` |
| `logout()` | clears both and removes `localStorage.token` |

Gaps: state is **not rehydrated** from `localStorage` on mount, so a refresh logs the user out while the stale token stays on disk (review #29); the token is never attached to axios (there is no request interceptor), so no authenticated endpoint is reachable from the UI even after a successful login; and nothing calls `login()` today because `Auth` is a stub. Exporting both `AuthProvider` and `useAuth` from one file also trips the ESLint `react-refresh/only-export-components` rule (review #40).

### `CartContext`

`src/context/CartContext.jsx`. Props: `children`. State: `cartItems` — an array of full product objects each with an added `quantity`.

| Value | Behaviour |
| --- | --- |
| `addToCart(item)` | increments `quantity` if `item.id` is already present, else appends with `item.quantity || 1` |
| `updateQuantity(id, quantity)` | sets an absolute quantity; callers clamp the bounds |
| `removeFromCart(id)` | drops the line |
| `clearCart()` | empties — **never called** |
| `cartItems` | the array |

Gaps: memory-only, so a refresh empties the cart (review #31); `POST/GET/PUT/DELETE /api/cart` are never called; no stock check inside the context (each caller does its own); no derived totals (`Cart` and `FloatingCart` each recompute).

### `src/utils/api.js`

A single axios instance, `baseURL: "http://localhost:5000/api"` hardcoded (review #28) with no interceptors, no timeout and no `withCredentials`.

## Pages

### `Home` — `src/pages/Home/index.jsx`

The storefront landing page. No props.

| State | Purpose |
| --- | --- |
| `activeSlide` | index of the Swiper hero slide, for the custom pagination dots |
| `swiperRef` (ref) | Swiper instance, for the prev/next buttons |
| `selectedService` | the service chosen in `ServicesNav` — **set but never rendered**, so clicking a service other than the two hardcoded ones does nothing visible (review #37) |
| `serviceDetailRef` (ref) | scroll target for the selected service — also unused |

Composition, in order: Swiper hero → `ServicesNav` → `SpotlightCard` (i.e. `SpotlightGrid`) → `FeaturedCollections` → `Products type="hotdeals"` → `NewArrivals` → `Products type="bestselling"` → `TrustBadges` → `Products type="all"` → `ServicesSpotlightSection`.

Three `Products` instances each fetch the full `/api/products` list independently. Imports `Tabs`, `Categories` and `Reveal` without using them (review #36), and imports `SpotlightCard` with the wrong casing (review #27).

### `Auth` — `src/pages/Auth/index.jsx`

**NOT IMPLEMENTED.** The whole file is `<div>Auth Page</div>` (review #32). No props, no state. `POST /api/auth/register` and `POST /api/auth/login` are unconsumed; `Navbar`'s account icon links here. Options in [07](./07-implementation-suggestions.md#1-auth-and-admin-pages-are-stubs-review-32-33).

### `Admin` — `src/pages/Admin/index.jsx`

**NOT IMPLEMENTED.** The whole file is `<div>Admin Page</div>` (review #33). Every admin-only backend endpoint (product/category/service/slide CRUD, order management, service-request triage, image upload) therefore has no UI. The route is also unguarded, though today that exposes nothing.

### `Services` — `src/pages/Services/index.jsx`

**NOT IMPLEMENTED.** `<div>Service Page</div>`. Note the component is named `Service` while the route and import are `Services`. `ServicesSpotlightSection` links here.

### `Shop` — `src/pages/Shop/index.jsx`

Catalogue with sidebar filters. No props.

| State | Purpose |
| --- | --- |
| `products`, `categories` | fetched in one `Promise.all` on mount |
| `loading` | skeleton/spinner gate; `finally`-cleared |
| `searchParams` | URL state: `?q=` (search term) and `?cat=` (category id) |
| `selectedCat` | active category; resynced from `?cat=` by an effect |
| `selectedBrand` | active brand, derived client-side from the product list |
| `sort` | `default` / price / name ordering, client-side |

All filtering, searching and sorting happen **in the browser over the full unpaginated product list** — `GET /api/products/search` is never called (review #25), and brand options come from the loaded products rather than `GET /api/categories/:id/brands`. Errors are swallowed into `console.log("Failed to load shop data")` with no user-facing message (review #38). Renders `ProductCard` per product.

### `ProductDetail` — `src/pages/ProductDetail/index.jsx`

Single product view at `/shop/:id`. Props: none (`id` from `useParams`).

| State | Purpose |
| --- | --- |
| `product` | the fetched product |
| `category` | matched from the categories list by `category_id` |
| `related` | other products in the same category |
| `loading`, `notFound` | render gates (404 sets `notFound`) |
| `quantity` | quantity selector, clamped to `stock_quantity` |
| `tab` | `description` / other detail tab |

Fetches `/products/:id`, `/categories` and `/products` in parallel — the full catalogue is downloaded just to compute "related products". Reads `product.old_price` to show a struck-through price; **that column does not exist** (review #34), so `Number(undefined)` is `NaN`, `hasDiscount` is `false`, and the discount UI silently never appears. "Buy now" adds to the cart and navigates to `/cart`, not to a checkout.

### `Cart` — `src/pages/Cart/index.jsx`

Cart review page. No props, no local state — everything comes from `CartContext`; `subtotal` is computed inline. Shows an empty state when `cartItems` is empty, otherwise a line-item table with quantity steppers (lower bound 1, upper bound `stock_quantity ?? Infinity`), a remove button and a summary card. There is no shipping, tax or discount line — Total equals Subtotal.

`Checkout` calls `navigate("/checkout")`, **a route that does not exist** (review #30): the click blanks the page body.

### `ItServices` — `src/pages/Services/ItServices.jsx`

Long static marketing page for IT services: hero, services grid, "why us" section and a request form. No props.

| State | Purpose |
| --- | --- |
| `submitted` | swaps the form for a thank-you message |

`handleSubmit` calls `event.preventDefault()` then `setSubmitted(true)`. **The form's six fields — company, contact, email, phone, service, message — are exactly the body `POST /api/service_requests` expects, and it is never called; every lead is discarded** (review #43). Fields are uncontrolled and never read.

### `CreativeStudio` — `src/pages/Services/CreativeStudio.jsx`

Same structure and the same discarding form, for creative services. State: `submitted`. Cross-links to `/services/it-services` (exists) and `/services/workspace-transformation` (**MISSING route**).

## Components

| Component | Props | State | Purpose and notes |
| --- | --- | --- | --- |
| `Navbar.jsx` | none | `query`, `catId`, `categories` | Logo, category dropdown, search box, account link (`/auth`), cart link. Fetches `/categories` on mount; search pushes `/shop?q=&cat=`. Destructures `user`, `logout` from `useAuth` and **never uses them** (review #35) — there is no logged-in state, no logout control. Contact phone `030 397 2421` is hardcoded here |
| `FloatingCart.jsx` | none | `visible` | Fixed cart button that fades in after `scrollY > 80`; badge shows the summed quantity from `CartContext`. Listener is cleaned up correctly |
| `Footer.jsx` | none | none | Five link columns from a module-level `columns` array. **Every link is `to="#"`** and the brand is still the placeholder "X Example" (review #42) |
| `Products.jsx` | `type`: `"hotdeals" \| "bestselling" \| "featured" \| "all"` (no default; anything else renders the "Best Selling" list) | `products`, `added` (per-id flash), `scrollRef` | Four layouts over one `GET /api/products`. Each mounted instance fetches the whole catalogue. `type="featured"`/`"hotdeals"` slice 7, `"all"` slices 12, `"bestselling"` renders a horizontal carousel of everything. Reads `product.review_count \|\| 0` — **field does not exist** (review #34), so it always renders `(0)`. `isNewProduct` calls `Date.now()` during render (review #41). `useEffect` has no `catch` (review #39) |
| `ProductCard.jsx` | `product` (required; `id`, `name`, `brand`, `price`, `image_url`, `stock_quantity`, `is_featured`, `old_price`) | `added` | Grid card used by `Shop` and `ProductDetail`. Add-to-cart is disabled when out of stock. Reads `product.old_price` — **MISSING column** |
| `NewArrivals.jsx` | none | `products`, `slides`, `dot`, `added` | Video hero from `GET /api/featured-slides` plus the four newest products from `GET /api/products`. Returns `null` when either list is empty, so **the whole section disappears until an admin has created at least one featured slide** — and there is no admin UI to create one. Links the hero to `/shop/{slide.product_id}` |
| `FeaturedCollectections.jsx` (filename misspelled; exports `FeaturedCollections`) | none | none | Static collection cards from imported assets. The prev/next arrow buttons have no handlers (review #46) |
| `TrustBadges.jsx` | none | none | Four static badges; "Learn More" links are `href="#"` |
| `ServicesNav.jsx` | `onSelect(service)` (required — called unconditionally, so omitting it throws) | `services`, `activeId` | Horizontal service strip from `GET /api/services`. Branches on the **exact** name strings `"IT Services"` and `"Creative Studio"` to route to dedicated pages; any other service just sets `activeId` and calls `onSelect`, whose result `Home` never renders. Renaming a row in the database silently breaks navigation (review #47) |
| `ServicesSpotlightSection.jsx` | none | none | Static promo cards linking to `/services/it-services` and `/services` (the latter is a stub page) |
| `Categories.jsx` | none | `categories`, `selectedCat`, `brands` | Category list with brand drill-down; the only consumer of `GET /api/categories/:id/brands`. **UNUSED** — imported by `Home` but never rendered, so that endpoint is effectively dead in the UI |
| `Tabs.jsx` | none | none | Static `Link` strip. **UNUSED** (imported by `Home`, never rendered) |
| `Reveal.jsx` | `children` (required), `className` (optional, defaults `""`) | `visible` | IntersectionObserver fade-in wrapper. **UNUSED** (imported by `Home`, never rendered). Sets state from inside an effect-registered observer (review #41) |
| `spotlightCard.jsx` | `SpotlightCard`: `card` (required — `image`, `title`, `eyebrow?`, `subtitle?`, `price?`, `buttonText`, `theme`), `className` (optional, `""`). Default export `SpotlightGrid` takes none | none | Four hardcoded promo cards over imported assets; the card CTA buttons are inert. **Filename is lowercase while `Home` imports `SpotlightCard`** — the build break |
| `HeroTextCard.jsx` | none | none | Static hero text block. **UNUSED** — not imported anywhere (dead file) |
| `ItServicesCard.jsx` | none | none | Static "IT problems we solve" card linking to `/services/it-services`. **UNUSED** — dead file |
| `PcShowcase.jsx` | none | none | Three autoplaying `<video>` cards from `public/videos/*.mp4` linking to `/shop`. **UNUSED** — dead file, and the only consumer of those video assets |

## Cross-cutting frontend gaps

| Gap | Effect |
| --- | --- |
| No token interceptor | Every authenticated endpoint is unreachable from the UI |
| No route guards | `/admin` is open (harmless only because it is empty) |
| No error UI | Failures are `console.log`ged or unhandled; users see blank sections |
| No loading skeletons outside `Shop`/`ProductDetail` | Sections pop in |
| Repeated full-catalogue fetches | Home issues `GET /api/products` three times |
| Five unused components + three unused imports in `Home` | Dead weight and lint errors |
| `npm run lint` fails with 15 errors | See [06-setup.md](./06-setup.md#current-check-status) |
