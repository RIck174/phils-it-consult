# 5. Data models

All ten tables are defined in one `CREATE TABLE IF NOT EXISTS` batch in `backend/src/models/index.js`, executed on every boot from `server.js`.

Schema-wide characteristics that apply to every table below:

- **No migrations.** `IF NOT EXISTS` means the batch is a no-op once the tables exist, so **any change to a column is invisible to an existing database**. Adding `products.old_price` requires a manual `ALTER TABLE` or dropping the database.
- **Almost nothing is `NOT NULL`.** Only `featured_slides.video_url` is required. Every other column — including `users.email`, `users.password` and `products.price` — accepts `NULL`.
- **No `UNIQUE` constraints at all**, including on `users.email`.
- **No indexes** beyond the implicit primary keys, so foreign-key lookups (`cart.user_id`, `order_items.order_id`) are sequential scans.
- **No `ON DELETE` behaviour** except `featured_slides.product_id`, which cascades. Every other FK defaults to `NO ACTION`, so deleting a referenced row raises a constraint error that controllers surface as a generic 500.
- `createTables()` is fired without `await` before `app.listen()` (review #21), so the server can accept requests before the tables exist, and a failure only prints `Failed to create table:` to the console.
- `DECIMAL(10,2)` values are returned by `pg` as **strings** in JSON, which is why the frontend wraps prices in `Number(...)`.

---

## `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | SERIAL | PK |
| `name` | VARCHAR(255) | nullable |
| `email` | VARCHAR(255) | nullable, **not unique** (review #9) — the same address can register any number of times; `login` returns `rows[0]` |
| `password` | VARCHAR(255) | bcrypt hash, 10 rounds |
| `role` | VARCHAR(50) | default `'customer'`; the only other value used in code is `'admin'`. Not constrained, and **not settable through the API** — the first admin must be promoted with SQL |
| `created_at` | TIMESTAMP | default `CURRENT_TIMESTAMP` |

Referenced by `orders.user_id`, `cart.user_id`, `reviews.user_id`.

## `categories`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | SERIAL | PK |
| `name` | VARCHAR(255) | nullable, not unique |
| `created_at` | TIMESTAMP | default now |

Referenced by `products.category_id`. Deleting a category with products attached fails with a 500.

## `products`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | SERIAL | PK |
| `name` | VARCHAR(255) | |
| `description` | VARCHAR(255) | **255-char cap** while `services.description` is `TEXT` — inconsistent, and long copy is rejected outright |
| `price` | DECIMAL(10,2) | serialised as a string |
| `brand` | VARCHAR(255) | free text; `GET /api/categories/:id/brands` does `SELECT DISTINCT` over it, so typos become new brands |
| `stock_quantity` | INTEGER | never decremented by any code path |
| `image_url` | VARCHAR(255) | a Cloudinary URL from `POST /api/upload` |
| `category_id` | INTEGER | FK → `categories(id)`, nullable, no cascade |
| `is_featured` | BOOLEAN | default `false`; set by the API but **read by nothing in the UI except `ProductCard`'s badge** |
| `created_at` | TIMESTAMP | default now; the frontend derives "is new" from this (≤14 days) |

**Columns the frontend expects but that do not exist:**

| Expected | Read by | Consequence |
| --- | --- | --- |
| `old_price` | `ProductCard.jsx`, `ProductDetail` | `Number(undefined) → NaN`, comparison false, discount UI never renders |
| `review_count` | `Products.jsx` | always renders `(0)`. Would be a `COUNT(*)` over `reviews`, not a stored column |
| `is_new` | — | derived client-side from `created_at` |

## `orders`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | SERIAL | PK |
| `user_id` | INTEGER | FK → `users(id)`, nullable |
| `total_amount` | DECIMAL(10,2) | **taken verbatim from the request body** (review #7) — never derived from product prices |
| `status` | VARCHAR(50) | default `'pending'`; free text, unconstrained. `createOrder` destructures a `status` from the body and then ignores it |
| `created_at` | TIMESTAMP | default now |

No shipping address, payment reference, currency or `updated_at`. `cancelOrder` **hard-deletes** the row rather than setting a cancelled status.

## `order_items`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | SERIAL | PK |
| `order_id` | INTEGER | FK → `orders(id)`, no cascade |
| `product_id` | INTEGER | FK → `products(id)` |
| `quantity` | INTEGER | |
| `price` | DECIMAL(10,2) | intended as the price *at time of purchase* — the reason the table needs its own `price` rather than joining `products` |

**This table is never written to and never read** (review #8). No controller, route or query mentions it. See below.

## `cart`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | SERIAL | PK |
| `user_id` | INTEGER | FK → `users(id)` |
| `product_id` | INTEGER | FK → `products(id)` |
| `quantity` | INTEGER | not constrained to be positive |
| `created_at` | TIMESTAMP | default now |

No `UNIQUE (user_id, product_id)`, so `POST /api/cart` creates a duplicate row each time the same product is added. Endpoints exist but **no client calls them** — the storefront's cart is React state only.

## `reviews`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | SERIAL | PK |
| `user_id` | INTEGER | FK → `users(id)` |
| `product_id` | INTEGER | FK → `products(id)` |
| `rating` | INTEGER | unconstrained — nothing enforces 1–5 |
| `comment` | TEXT | |
| `created_at` | TIMESTAMP | default now |

**Orphan table**: no controller, no routes, no UI. It is the missing source for the `review_count` the product grid already tries to display, and for the star ratings that are currently hardcoded in the markup.

## `services`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | SERIAL | PK |
| `name` | VARCHAR(255) | **`ServicesNav` branches on the exact strings `"IT Services"` and `"Creative Studio"`** — renaming a row breaks navigation silently |
| `description` | TEXT | |
| `image_url` | VARCHAR(255) | |
| `created_at` | TIMESTAMP | default now |

No `slug`, no ordering column and no link to the marketing pages that describe each service, which is why routing is hardcoded by name.

## `service_requests`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | SERIAL | PK |
| `company_name` | VARCHAR(255) | body sends `companyName` |
| `contact_person` | VARCHAR(255) | body sends `contactPerson` |
| `email` | VARCHAR(255) | unvalidated |
| `phone` | VARCHAR(50) | |
| `service_type` | VARCHAR(255) | free text, **not an FK to `services`** |
| `message` | TEXT | |
| `status` | VARCHAR(50) | default `'pending'`, unconstrained |
| `created_at` | TIMESTAMP | default now |

The only write path is public (`POST /api/service_requests`) — with no validation, captcha or rate limit. Nothing in the repo currently posts to it, so the table stays empty in practice.

## `featured_slides`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | SERIAL | PK |
| `product_id` | INTEGER | FK → `products(id)` **`ON DELETE CASCADE`** — the only cascade in the schema |
| `video_url` | VARCHAR(255) | **`NOT NULL`** — the only required column in the schema |
| `badge` | VARCHAR(100) | default `'Just Arrived'` |
| `display_order` | INTEGER | default `0`; ties order arbitrarily |
| `created_at` | TIMESTAMP | default now |

`GET /api/featured-slides` inner-joins `products`, so a slide only appears while its product exists. `NewArrivals` renders nothing at all when this table is empty — and the admin UI needed to populate it does not exist.

---

## Relationships

```
users ──1:N──► orders ──1:N──► order_items ◄──N:1── products
  │                              (NEVER WRITTEN)        ▲
  ├──1:N──► cart ───────────────────────────N:1────────┤
  │           (API exists, UI never calls it)           │
  └──1:N──► reviews ────────────────────────N:1────────┘
              (no controller, no route, no UI)

categories ──1:N──► products ──1:N──► featured_slides  (ON DELETE CASCADE)

services            service_requests
  (no FK between them — service_type is free text)
```

| Relationship | Column | State |
| --- | --- | --- |
| user → cart lines | `cart.user_id` | Works at the API level; unused by the UI |
| user → orders | `orders.user_id` | Set from `req.user.id`; correct |
| order → line items | `order_items.order_id` | **BROKEN — never populated** |
| product → line items | `order_items.product_id` | **BROKEN — never populated** |
| product → cart lines | `cart.product_id` | Works; `GET /api/cart` does not join, so the client gets only ids |
| category → products | `products.category_id` | Works; used for filtering and related products |
| product → featured slides | `featured_slides.product_id` | Works, with cascade |
| user/product → reviews | `reviews.*` | Table exists, nothing uses it |
| service → service request | none | `service_type` is an unvalidated string |

### The broken relationship: `order_items`

`createOrder` runs exactly one statement:

```sql
INSERT INTO orders (user_id, total_amount) VALUES ($1, $2)
```

Consequences:

1. **An order has no contents.** Nothing records which products were bought, in what quantity, at what price — the whole point of `order_items`.
2. **Totals are unverifiable.** `total_amount` comes from the client and there are no line items to reconcile it against, so an under-priced order is undetectable after the fact.
3. **Nothing else can be built on orders.** Fulfilment, invoices, stock decrements, revenue-by-product reporting and "buy again" all require line items.
4. **The cart is never consumed.** Placing an order neither reads `cart` nor clears it.
5. **Historical pricing is lost even if line items are added later**, since existing orders have none.

A correct `createOrder` would, inside a single transaction: read the authenticated user's `cart` rows joined to `products`; verify stock; compute `total_amount` server-side; insert `orders`; insert one `order_items` row per line with the current `products.price`; decrement `stock_quantity`; delete the user's `cart` rows; commit. Approaches and trade-offs are in [07](./07-implementation-suggestions.md#2-no-checkout-route-or-order-flow-review-30).

### Cart state exists in two disconnected places

The `cart` table with full CRUD, and `CartContext`'s in-memory array. They never meet: the UI never calls the API, and the API is never exercised. Either one becomes authoritative or they need a defined sync — see [07](./07-implementation-suggestions.md#3-cart-does-not-persist-review-31).

## Schema changes implied by the current frontend

If the frontend is treated as the requirement, the schema needs:

| Change | Reason |
| --- | --- |
| `ALTER TABLE products ADD COLUMN old_price DECIMAL(10,2)` | `ProductCard` / `ProductDetail` discount display |
| `review_count` exposed on product reads (aggregate, not a column) | `Products.jsx` rating count; requires a reviews API |
| `UNIQUE (user_id, product_id)` on `cart` | so add-to-cart can upsert |
| `NOT NULL` + `UNIQUE` on `users.email` | prevent duplicate accounts |
| `NOT NULL` on `users.password`, `products.price`, `products.name` | data integrity |
| `CHECK (rating BETWEEN 1 AND 5)` on `reviews` | validity |
| `CHECK`/enum on `orders.status`, `service_requests.status` | prevent typo'd statuses |
| `ON DELETE` policies on the remaining FKs | avoid 500s on delete |
| `products.description` → `TEXT` | match `services.description` |
| A real migration tool (node-pg-migrate, Knex, Prisma, Drizzle) | none of the above can reach an existing database through `IF NOT EXISTS` |
