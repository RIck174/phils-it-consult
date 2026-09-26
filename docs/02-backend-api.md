# 2. Backend routes and controllers

Base URL: `http://localhost:5000/api` (port from `PORT`, default 5000).

All requests and responses are JSON (`express.json()`, default 100 kb limit). CORS is fully open (`cors()` with no options). There is **no central error handler and no 404 handler** — each controller catches its own errors and unmatched paths fall through to Express's default HTML 404.

## Middleware

### `authenticate` — `src/middleware/auth.js`

Reads `Authorization: Bearer <token>`, verifies it with `JWT_SECRET`, and sets `req.user = { id, role, iat, exp }`.

```js
const token = req.headers.authorization.split(" ")[1];   // ← BROKEN (review #4)
```

The header is dereferenced before any guard, so a request **without** an `Authorization` header throws `TypeError: Cannot read properties of undefined (reading 'split')` and produces a 500 instead of a 401. The `if (!token)` check below it is therefore unreachable for the common case. A malformed-but-present header still reaches `jwt.verify` and correctly yields `401 {"message":"Unauthorized user"}`.

### `isAdmin` — `src/middleware/auth.js`

Requires `req.user.role === "admin"`, else `403 {"message":"Unautorized User, Access denied"}` (typo in source). Assumes `authenticate` ran first; it would throw if mounted alone. There is no way to create an admin through the API — `role` defaults to `'customer'` in the schema and `register` does not accept it, so the first admin must be set directly in the database.

### Auth legend used below

| Marker | Meaning |
| --- | --- |
| public | No middleware |
| user | `authenticate` |
| admin | `authenticate, isAdmin` |

---

## `routes/auth.js` → `controllers/authController.js`

Mounted at `/api/auth`.

### `POST /api/auth/register` — public

Hashes the password with bcrypt (10 rounds) and inserts a user. `role` is not settable; the column defaults to `customer`.

| | |
| --- | --- |
| Request | `{ "name": string, "email": string, "password": string }` |
| 201 | `{ "message": "User registered successfully" }` |
| 500 | `{ "message": "Server failed to register new user", "err": <pg error message> }` |

Notes: no validation of any field; no duplicate-email check and no `UNIQUE` constraint on `users.email` (review #9), so the same address can register repeatedly. `bcrypt.hash` is called **outside** the `try`, so a missing `password` rejects before the handler's own error path. No user object or token is returned — the client must call `/login` separately.

### `POST /api/auth/login` — public

| | |
| --- | --- |
| Request | `{ "email": string, "password": string }` |
| 200 | `{ "messages": "Welcome back", "token": "<JWT>" }` — note the key is `messages`, not `message` (review #24) |
| 400 | `{ "message": "Your email or password is incorrect" }` (unknown email *or* wrong password) |
| 500 | `{ "message": "Server error", "err": <message> }` |

The JWT payload is `{ id, role }` with `expiresIn: "2d"`. No refresh token, no logout/revocation, no rate limiting (review #12). If duplicate emails exist, `rows[0]` wins. **No endpoint returns the current user** — there is no `GET /api/auth/me`, so a client that only holds a token cannot discover its own `name`/`role` without decoding the JWT.

---

## `routes/products.js` → `controllers/productController.js`

Mounted at `/api/products`. Route order matters here and is correct: `/search` is declared before `/:id`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/products` | public | All products, unpaginated `SELECT *` |
| GET | `/api/products/search?q=<term>` | public | `ILIKE '%q%'` across `name`, `brand`, `description` |
| GET | `/api/products/:id` | public | One product, 404 if absent |
| POST | `/api/products` | admin | Create |
| PUT | `/api/products/:id` | admin | Full replace — every column is overwritten |
| DELETE | `/api/products/:id` | admin | Hard delete |

Product body (POST and PUT, identical):

```jsonc
{
  "name": "string",
  "description": "string",      // stored in VARCHAR(255) — silently rejected over 255 chars
  "price": 1299.99,             // DECIMAL(10,2); pg returns it as a STRING on read
  "brand": "string",
  "stock_quantity": 12,
  "image_url": "https://res.cloudinary.com/...",
  "category_id": 3,
  "is_featured": true
}
```

Responses:

- `GET /` → `Product[]`; `GET /:id` → `Product` or `404 {"message":"Product not found"}`
- `POST` → `201 { "message": "Product added successfully", "product": <row> }`
- `PUT` → `200 { "messages": "Product updated successfully" }` (again `messages`; the `RETURNING *` row is discarded and **no 404 is returned for an unknown id** — review #15)
- `DELETE` → `200 { "message": "Product successfully deleted" }`, also without an existence check. Deleting a product referenced by `cart` or `order_items` raises a foreign-key error surfaced as a generic 500 (review #19)
- Errors → 500; `getAllProducts`/`getProductById`/`searchProducts` include `err: error.message` (review #10)

`searchProducts` with no `q` parameter matches `%undefined%`. All queries are parameterised, so there is no SQL injection exposure.

---

## `routes/categories.js` → `controllers/categoryController.js`

Mounted at `/api/categories`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/categories` | public | `[{ id, name, created_at }]` |
| GET | `/api/categories/:id/brands` | public | `[{ brand }]` — `SELECT DISTINCT brand FROM products WHERE category_id = $1` |
| POST | `/api/categories` | admin | Body `{ "name": string }` → `201 { "message": "New category created" }` (created row not returned) |
| DELETE | `/api/categories/:id` | admin | `200 { "message": "Category successfully deleted" }`; fails with a 500 if products still reference it |

Error responses here do **not** leak `error.message`.

---

## `routes/cart.js` → `controllers/cartController.js`

Mounted at `/api/cart`. **Currently called by nothing** — the storefront keeps its cart in React state only (review #31).

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/cart` | user | `SELECT * FROM cart WHERE user_id = req.user.id` → `[{ id, user_id, product_id, quantity, created_at }]` |
| POST | `/api/cart` | user | Body `{ "productId": number, "quantity": number }` → `201 { "message": "Item added to cart" }` |
| PUT | `/api/cart/:id` | user | Body `{ "quantity": number }` → `201 { "message": "Quantity updated" }` (201 on an update) |
| DELETE | `/api/cart/:id` | user | `200 { "message": "Item removed from cart" }` |

Gaps:

- **IDOR (review #5)** — `PUT` and `DELETE` match on `cart.id` only, never `user_id`. Any authenticated user can mutate or delete another user's cart rows.
- `POST` always inserts, so adding the same product twice creates two rows rather than incrementing; there is no unique constraint on `(user_id, product_id)`.
- `GET` returns raw cart rows with no product join, so a client gets `product_id` only and must fetch each product separately.
- No stock validation, no non-negative quantity check.

---

## `routes/orders.js` → `controllers/orderController.js`

Mounted at `/api/orders`. **Currently called by nothing.**

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/orders` | user | Create an order for the caller |
| GET | `/api/orders` | admin | All orders |
| GET | `/api/orders/:id` | user | One order — **no ownership check** |
| PUT | `/api/orders/:id` | admin | Body `{ "status": string }` → `200 { "message": "Order updated succesfully" }` |
| DELETE | `/api/orders/:id` | user | Hard-deletes the order — **no ownership check** |

`POST` body: `{ "totalAmount": number, "status": string }`. Only `totalAmount` is used; `status` is destructured and ignored, always falling back to the `'pending'` column default.

Gaps:

- **Client-supplied totals (review #7)** — `total_amount` is whatever the client sends. A GH₵ 5,000 basket can be submitted as GH₵ 1. Totals must be computed server-side from `products.price`.
- **IDOR (review #6)** — `GET /:id` and `DELETE /:id` are `authenticate`-only and filter on `id` alone.
- **No line items (review #8)** — `order_items` is never written, so an order records an amount and nothing else. See [05-data-models.md](./05-data-models.md#the-broken-relationship-order_items).
- Cancelling hard-deletes the row instead of setting `status = 'cancelled'`, destroying the audit trail (and it would fail once `order_items` rows referenced it).
- Stock is never decremented; the cart is never cleared.

---

## `routes/services.js` → `controllers/serviceController.js`

Mounted at `/api/services`. Drives the storefront's `ServicesNav`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/services` | public | `[{ id, name, description, image_url, created_at }]` |
| POST | `/api/services` | admin | Body `{ "name", "description", "image_url" }` → `201 { "message": "New Service added" }` |
| PUT | `/api/services/:id` | admin | Same body → `200 { "message": "Update succesful" }` |
| DELETE | `/api/services/:id` | admin | `200 { "message": "Service successfully deleted" }` |

`ServicesNav` branches on the exact strings `"IT Services"` and `"Creative Studio"` to decide whether to navigate to a dedicated route, so those two rows must be named exactly that in the database (see [04](./04-dependency-map.md#servicesnavjsx)). The controller export is `AddNewService` — the only PascalCase function name in the codebase.

---

## `routes/serviceRequests.js` → `controllers/serviceRequestController.js`

Mounted at `/api/service_requests` (underscore, unlike the hyphenated `featured-slides`).

### `POST /api/service_requests` — public

The endpoint the three contact forms in the repo *should* be calling and none currently do (review #44).

```jsonc
{
  "companyName":   "Acme Ltd",
  "contactPerson": "Ama Mensah",
  "email":         "ama@acme.com",
  "phone":         "+233 ...",
  "serviceType":   "Network setup",
  "message":       "We are moving office next month."
}
```

Inserts the row (snake_case columns), then sends an HTML notification email to `EMAIL_USER` via `sendEmail`. Returns `201 { "message": "Request sent" }` or `500 { "message": "Failed to send request." }`.

Gaps:

- Field names are camelCase in the body but snake_case in the table — a client must not send `company_name`.
- If the email send fails, the client gets a 500 **after the row is already committed** (review #18), so a "failed" request may in fact be stored.
- The email body interpolates the submitted values into HTML without escaping (review #11).
- Subject is `"New service from" + companyName` — missing space.
- No validation, no spam protection, no rate limiting on a public write endpoint.

### `GET /api/service_requests` — admin

All requests. Contains a dead guard — `if (!Allrequest)` can never be true for a pg result object (review #16); an empty table returns `200 []`, never the intended 404.

### `PUT /api/service_requests/:id` — admin

Body `{ "status": string }` → `200 { "message": "Status updated" }`. Status values are free-form strings; the column defaults to `'pending'` and nothing constrains it.

---

## `routes/featuredSlides.js` → `controllers/featuredSlideController.js`

Mounted at `/api/featured-slides` (hyphen).

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/featured-slides` | public | Slides joined to their product, ordered by `display_order ASC` |
| POST | `/api/featured-slides` | admin | Body `{ "product_id", "video_url", "badge", "display_order" }` → `201 { message, slide }` |
| DELETE | `/api/featured-slides/:id` | admin | `200 { "message": "Featured slide successfully deleted" }` |

`GET` response shape (an `INNER JOIN`, so a slide whose product was deleted simply disappears — and the FK is `ON DELETE CASCADE`, so the slide row is removed anyway):

```jsonc
[{
  "id": 1, "video_url": "...", "badge": "Just Arrived", "display_order": 0,
  "product_id": 12, "name": "...", "brand": "...", "price": "1299.00",
  "description": "...", "created_at": "..."
}]
```

Consumed by `NewArrivals.jsx`, which renders `video_url` in an autoplaying `<video>`. Note the join aliases the *product* id as `product_id` while `id` is the *slide* id — `NewArrivals` links using `product_id`, which is correct.

---

## `routes/upload.js`

Mounted at `/api/upload`. Declared as admin-only but **is not** (review #1).

### `POST /api/upload` — nominally admin, effectively public for the file-parsing step

```js
router.post("/", upload.single("image"), authenticate, isAdmin, handler);
//               ^^^^^^^^^^^^^^^^^^^^^^ runs BEFORE auth
```

Multer buffers the entire upload into memory before `authenticate` is reached, so an anonymous caller can make the server allocate arbitrary memory. `src/utils/multer.js` sets no `limits.fileSize` and no `fileFilter` (review #2), so any type and any size is accepted. The handler also dereferences `req.file.buffer` with no guard, giving a 500 when the field name is not `image` (review #3).

| | |
| --- | --- |
| Request | `multipart/form-data` with a single `image` field |
| 200 | `{ "url": "https://res.cloudinary.com/<cloud>/image/upload/.../phils-it/<id>.<ext>" }` |
| 500 | `{ "message": "Upload failed", "error": <message> }` |

Uploads go to the Cloudinary folder `phils-it`. The returned URL is meant to be stored in `products.image_url` / `services.image_url`, both `VARCHAR(255)`. Nothing in the storefront calls this endpoint today (the admin UI is a stub).

---

## Response-shape inconsistencies worth knowing

| Pattern | Where |
| --- | --- |
| `messages` instead of `message` | `login`, `updateProduct` |
| Created row returned | products, featured slides |
| Created row **not** returned | categories, services, cart, orders |
| `err: error.message` leaked | auth, products, cart, `getAllOrders`, `getOrderById` |
| 201 used for an update | `PUT /api/cart/:id` |
| 404 on missing row | only `GET /api/products/:id` and `GET /api/orders/:id` |
| Path separator | `service_requests` (underscore) vs `featured-slides` (hyphen) |
