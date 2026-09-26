# 4. Dependency map

One tree per page and component: the files it imports, the backend endpoints it calls, the response fields it reads, and anything it depends on that does not exist.

**Legend** — `MISSING` = referenced but absent from the codebase/schema/router. `UNUSED` = the file exists but nothing renders it. External npm packages are listed only where they matter (routing, HTTP, animation).

Every `api.*` call goes through `src/utils/api.js`, whose base URL is hardcoded to `http://localhost:5000/api`, and **no request carries an `Authorization` header** — so only public endpoints are reachable.

## Summary: endpoints used vs. available

| Endpoint | Used by |
| --- | --- |
| `GET /api/products` | `Products` (×3 on Home), `NewArrivals`, `Shop`, `ProductDetail` |
| `GET /api/products/:id` | `ProductDetail` |
| `GET /api/categories` | `Navbar`, `Shop`, `ProductDetail`, `Categories` (unused component) |
| `GET /api/categories/:id/brands` | `Categories` only — **which is never rendered** |
| `GET /api/services` | `ServicesNav` |
| `GET /api/featured-slides` | `NewArrivals` |
| `GET /api/products/search` | **nobody** — `Shop` filters client-side |
| `POST /api/auth/register`, `POST /api/auth/login` | **nobody** — `Auth` is a stub |
| all `/api/cart` | **nobody** — cart is in React memory |
| all `/api/orders` | **nobody** — no checkout |
| `POST /api/service_requests` | **nobody** — all three contact forms discard input |
| all admin writes (products, categories, services, slides, upload, request status) | **nobody** — `Admin` is a stub |

---

## Application shell

```
main.jsx
  ├── imports: App.jsx, context/AuthContext.jsx, context/CartContext.jsx, index.css,
  │            react, react-dom/client, react-router-dom (BrowserRouter)
  ├── calls: —
  └── notes: StrictMode double-invokes effects in dev → every mount fetch fires twice

App.jsx
  ├── imports: components/Navbar.jsx, components/FloatingCart.jsx, components/Footer.jsx,
  │            pages/Home, pages/Auth, pages/Admin, pages/Services, pages/Shop, pages/Cart,
  │            pages/ProductDetail, pages/services/ItServices, pages/services/CreativeStudio
  ├── calls: —
  ├── MISSING (casing): "./pages/services/..." — real path is pages/Services/ → build fails on Linux
  ├── MISSING (route): /checkout — Cart navigates there
  └── MISSING (route): "*" catch-all — unknown URLs render an empty body

context/AuthContext.jsx
  ├── imports: react
  ├── calls: — (writes localStorage.token only)
  └── MISSING: rehydration on mount; axios request interceptor; any caller of login()

context/CartContext.jsx
  ├── imports: react
  ├── calls: — (memory only)
  └── MISSING: persistence; any use of the /api/cart endpoints

utils/api.js
  ├── imports: axios
  └── MISSING: env-driven base URL (import.meta.env.VITE_API_URL), auth interceptor, timeout
```

---

## Pages

```
pages/Home/index.jsx
  ├── imports (components): Tabs.jsx [UNUSED], Products.jsx, Categories.jsx [UNUSED],
  │        ServicesNav.jsx, SpotlightCard [→ spotlightCard.jsx], FeaturedCollectections.jsx,
  │        TrustBadges.jsx, ServicesSpotlightSection.jsx, NewArrivals.jsx, Reveal.jsx [UNUSED]
  ├── imports (assets): assets/SL.png, assets/stux-network-connection-414415_1920.jpg,
  │        assets/WorkspaceTransformation.jpg, assets/web.jpg
  ├── imports (pkg): react, react-icons/fi, swiper/react, swiper/modules,
  │        swiper/css + swiper/css/effect-fade + swiper/css/pagination
  ├── calls (direct): none — all fetching is inside children
  ├── calls (transitive): GET /api/services (ServicesNav), GET /api/products ×3 (Products),
  │        GET /api/products + GET /api/featured-slides (NewArrivals)
  ├── MISSING (casing): "../../components/SpotlightCard" — file is components/spotlightCard.jsx
  └── dead code: Tabs, Categories, Reveal imported but never rendered;
                 selectedService / serviceDetailRef set but never used

pages/Auth/index.jsx                    [STUB — returns <div>Auth Page</div>]
  ├── imports: —
  ├── calls: —
  └── MISSING: POST /api/auth/register, POST /api/auth/login wiring; token persistence

pages/Admin/index.jsx                   [STUB — returns <div>Admin Page</div>]
  ├── imports: —
  ├── calls: —
  └── MISSING: every admin endpoint (product/category/service/slide CRUD, POST /api/upload,
               GET /api/orders, PUT /api/orders/:id, GET/PUT /api/service_requests);
               also MISSING a route guard on /admin

pages/Services/index.jsx                [STUB — returns <div>Service Page</div>]
  ├── imports: —
  └── linked from: ServicesSpotlightSection.jsx

pages/Shop/index.jsx
  ├── imports: utils/api.js, components/ProductCard.jsx, react-router-dom (useSearchParams, Link),
  │            react-icons/fi
  ├── calls: GET /api/products, GET /api/categories   (Promise.all on mount)
  ├── expects (product): id, name, brand, price, image_url, stock_quantity, category_id, created_at
  ├── expects (category): id, name
  ├── reads URL params: ?q= (client-side filter), ?cat= (category id)
  ├── MISSING (endpoint not used): GET /api/products/search — search is done in the browser
  ├── MISSING (endpoint not used): GET /api/categories/:id/brands — brands derived from products
  └── MISSING (UX): pagination; error UI (failures go to console.log only)

pages/ProductDetail/index.jsx
  ├── imports: utils/api.js, context/CartContext.jsx, components/ProductCard.jsx,
  │            react-router-dom (useParams, useNavigate, Link), react-icons/fi
  ├── calls: GET /api/products/:id, GET /api/categories, GET /api/products   (Promise.all)
  ├── expects (product): id, name, brand, description, price, image_url, stock_quantity,
  │        category_id, created_at
  ├── MISSING (field): product.old_price — not a column; Number(undefined)=NaN so the
  │        "discount" block silently never renders
  ├── MISSING (route): a real checkout — "Buy now" adds to cart and goes to /cart
  └── inefficiency: downloads the whole catalogue just to compute related products

pages/Cart/index.jsx
  ├── imports: context/CartContext.jsx, react-router-dom (Link, useNavigate), react-icons/fi
  ├── calls: — (reads CartContext only)
  ├── expects (cart item): id, name, price, image_url, quantity, stock_quantity (optional)
  ├── MISSING (route): /checkout — the Checkout button navigates to a route App.jsx does not define
  └── MISSING (endpoints): POST /api/orders, /api/cart persistence; also no shipping/tax lines

pages/Services/ItServices.jsx
  ├── imports: react, react-icons/fi
  ├── calls: —
  ├── form fields: company, contact, email, phone, service, message
  ├── MISSING (endpoint): POST /api/service_requests — exists and expects exactly
  │        { companyName, contactPerson, email, phone, serviceType, message }; every lead is dropped
  └── duplicated by: phil-s-it-consult-landing-page/components/it-services-page.tsx

pages/Services/CreativeStudio.jsx
  ├── imports: react, react-icons/fi,
  │        assets/WhatsApp Image 2026-09-17 at 9.46.34 PM.jpeg,
  │        assets/WhatsApp Image 12026-09-17 at 9.46.34 PM.jpeg,
  │        assets/WhatsApp Image2 2026-09-17 at 9.46.34 PM.jpeg,
  │        assets/TechStore1.jpg
  ├── calls: —
  ├── MISSING (endpoint): POST /api/service_requests (same discarding form)
  ├── MISSING (route): /services/workspace-transformation — linked, never defined
  └── note: asset filenames contain spaces and an unstable date-based naming scheme
```

---

## Components

```
components/Navbar.jsx                   [rendered on every route]
  ├── imports: context/AuthContext.jsx, context/CartContext.jsx, utils/api.js,
  │            assets/PHILS CONSULT.jpg.jpeg, react-router-dom (Link, useNavigate), react-icons/fi
  ├── calls: GET /api/categories
  ├── expects: id, name
  ├── navigates to: /shop?q=<query>&cat=<catId>, /auth, /cart
  ├── MISSING (behaviour): user / logout are destructured from useAuth and never used —
  │        no signed-in state, no logout control, no admin link
  └── hardcoded: phone number 030 397 2421

components/FloatingCart.jsx             [rendered on every route]
  ├── imports: context/CartContext.jsx, react-router-dom (Link), react-icons/fi
  ├── calls: —
  └── expects (cart item): id, quantity

components/Footer.jsx                   [rendered on every route]
  ├── imports: react-router-dom (Link), react-icons/fi
  ├── calls: —
  └── MISSING (content): every link is to="#"; brand text is still the placeholder "X Example"

components/Products.jsx                 [rendered 3× by Home]
  ├── imports: utils/api.js, context/CartContext.jsx, assets/Lap.jpg (fallback image),
  │            react-router-dom (Link), react-icons/fi
  ├── props: type = "hotdeals" | "bestselling" | "featured" | "all"   (no default)
  ├── calls: GET /api/products                      (once per mounted instance)
  ├── expects: id, name, brand, description, price, image_url, stock_quantity, created_at
  ├── MISSING (field): product.review_count — read as `product.review_count || 0`, so the
  │        rating count always renders (0). The reviews table exists but has no API
  ├── MISSING (field): a real "is new" flag — derived from created_at <= 14 days instead
  └── MISSING (handling): the fetch effect has no catch; a failed request rejects unhandled

components/ProductCard.jsx              [used by Shop, ProductDetail]
  ├── imports: context/CartContext.jsx, react-router-dom (Link), react-icons/fi
  ├── props: product (required)
  ├── calls: —
  ├── expects: id, name, brand, price, image_url, stock_quantity, is_featured
  └── MISSING (field): product.old_price — not a column; the strike-through price never shows

components/NewArrivals.jsx              [rendered by Home]
  ├── imports: utils/api.js, context/CartContext.jsx, assets/Lap.jpg,
  │            react-router-dom (Link), react-icons/fi
  ├── calls: GET /api/products, GET /api/featured-slides
  ├── expects (product): id, name, description, price, image_url, stock_quantity, created_at
  ├── expects (slide): video_url, badge, product_id, name, brand, description, price
  ├── renders null when either list is empty → the section is invisible until a featured slide
  │        exists, and there is no admin UI to create one
  └── MISSING (handling): neither .then chain has a .catch

components/FeaturedCollectections.jsx   [rendered by Home; filename misspelled]
  ├── imports: assets/apple.jpg, assets/PC portable Gamer.jpg, assets/newAirpods.jpg,
  │            assets/Tab.jpg, react-icons/fi
  ├── calls: —
  └── MISSING (behaviour): the prev/next arrow buttons have no onClick — purely decorative

components/TrustBadges.jsx              [rendered by Home]
  ├── imports: react-icons/fi
  ├── calls: —
  └── MISSING (content): "Learn More" links are href="#"

components/ServicesNav.jsx              [rendered by Home]
  ├── imports: utils/api.js, react-router-dom (useNavigate)
  ├── props: onSelect(service) — required; called without a guard, so omitting it throws
  ├── calls: GET /api/services
  ├── expects: id, name, image_url (optional), description
  ├── MISSING (data contract): routing branches on the exact strings "IT Services" and
  │        "Creative Studio". Any other service name falls through to onSelect, and Home
  │        renders nothing for it — services 3..n are effectively dead links
  └── MISSING (route): a generic /services/:slug page would remove the hardcoding

components/ServicesSpotlightSection.jsx [rendered by Home]
  ├── imports: react-router-dom (Link), react-icons/fi
  ├── calls: —
  └── links to: /services/it-services (exists), /services (stub page)

components/Categories.jsx               [UNUSED — imported by Home, never rendered]
  ├── imports: utils/api.js
  ├── calls: GET /api/categories, GET /api/categories/:id/brands
  ├── expects: id, name; brand
  └── note: the ONLY consumer of the brands endpoint, so that endpoint is dead in the running UI

components/Tabs.jsx                     [UNUSED — imported by Home, never rendered]
  ├── imports: react-router-dom (Link)
  └── calls: —

components/Reveal.jsx                   [UNUSED — imported by Home, never rendered]
  ├── imports: react
  ├── props: children (required), className (optional, default "")
  └── calls: —

components/spotlightCard.jsx            [rendered by Home via SpotlightGrid]
  ├── imports: assets/TechStore.jpg, assets/headphone.jpg, assets/Headphone2.jpg, assets/camera.jpg
  ├── exports: SpotlightCard({ card, className = "" }) [internal], default SpotlightGrid()
  ├── calls: —
  ├── MISSING (casing): Home imports "SpotlightCard"; the file is spotlightCard.jsx → build break
  └── MISSING (behaviour): each card's CTA button has no onClick/link

components/HeroTextCard.jsx             [UNUSED — dead file, nothing imports it]
  ├── imports: assets/mariakray-electronics-6801339_1920.jpg
  └── calls: —

components/ItServicesCard.jsx           [UNUSED — dead file, nothing imports it]
  ├── imports: react-router-dom (Link), react-icons/fi
  ├── calls: —
  └── links to: /services/it-services

components/PcShowcase.jsx               [UNUSED — dead file, nothing imports it]
  ├── imports: react-router-dom (Link), react-icons/fi
  ├── references (public): /videos/*.mp4 — the only consumer of frontend/public/videos
  ├── calls: —
  └── links to: /shop
```

---

## Landing page (`phil-s-it-consult-landing-page/`)

```
app/layout.tsx
  ├── imports: app/globals.css, next/font (Geist, Geist_Mono), @vercel/analytics/next
  ├── calls: —
  └── metadata.generator = "v0.app"  (indicates the page was produced by a design tool)

app/page.tsx
  ├── imports: components/it-services-page.tsx
  └── calls: —

components/it-services-page.tsx         [the whole site, one client component]
  ├── imports: react (useState), lucide-react icons
  ├── calls: NONE
  ├── form fields: company, contact person, email, phone, service type, message
  │        — identical in shape to POST /api/service_requests
  ├── MISSING (endpoint): POST /api/service_requests; handleSubmit only setSubmitted(true)
  ├── MISSING (route): /services/creative-studio — linked, does not exist in this Next app
  ├── MISSING (route): /services/workspace-transformation — linked, does not exist anywhere
  ├── MISSING (config): no API base URL / env var exists in this project at all
  ├── placeholder data: +233 24 000 0000, hello@philsitconsult.com
  └── duplicates: frontend/src/pages/Services/ItServices.jsx  (see 01-architecture.md)

components/ui/button.tsx                [UNUSED]
  ├── imports: @radix-ui/react-slot, class-variance-authority, lib/utils.ts
  └── nothing imports it

lib/utils.ts                            [UNUSED]
  ├── imports: clsx, tailwind-merge
  └── exports cn(); nothing imports it
```

---

## Consolidated list of missing things

### Missing files / casing

| Referenced as | Actual | Impact |
| --- | --- | --- |
| `./pages/services/ItServices`, `./pages/services/CreativeStudio` (`App.jsx`) | `pages/Services/…` | **Build fails** on case-sensitive filesystems |
| `../../components/SpotlightCard` (`Home`) | `components/spotlightCard.jsx` | **Build fails** on case-sensitive filesystems |

### Missing routes

| Route | Referenced by |
| --- | --- |
| `/checkout` | `pages/Cart/index.jsx` |
| `/services/workspace-transformation` | `CreativeStudio.jsx`, landing page |
| `/services/creative-studio` **within the Next app** | landing page |
| `*` catch-all / 404 page | `App.jsx` |
| `GET /api/auth/me` (endpoint, not route) | needed by any real auth UI |

### Missing fields

| Field | Read by | Status |
| --- | --- | --- |
| `products.old_price` | `ProductCard.jsx`, `ProductDetail` | Not a column — discount UI silently dead |
| `products.review_count` | `Products.jsx` | Not a column and no API; `reviews` table exists but is unused, so this would have to be a `COUNT` aggregate |
| `products.is_new` | — | Not a column; both components derive it from `created_at` within 14 days |

### Missing wiring (code exists on both sides but nothing connects them)

| Backend capability | Frontend state |
| --- | --- |
| `POST /api/service_requests` (+ email notification) | three forms discard their input |
| `/api/cart` CRUD | cart is memory-only |
| `/api/orders` | no checkout |
| `/api/auth` | `Auth` stub, no token interceptor |
| all admin endpoints incl. `POST /api/upload` | `Admin` stub |
| `GET /api/products/search` | `Shop` filters client-side |
| `GET /api/categories/:id/brands` | only the unrendered `Categories` component |
| `reviews` table | no controller, no route, no UI |
