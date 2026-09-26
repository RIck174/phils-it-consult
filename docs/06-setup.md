# 6. Local setup

Three independent projects, three installs. There is no root `package.json` and no command that runs everything at once.

## Prerequisites

| Tool | Version | Why |
| --- | --- | --- |
| Node.js | 20.x or newer (22+ recommended) | Next 16 and Vite 8 both require modern Node |
| npm | bundled with Node | `backend/` and `frontend/` (both have `package-lock.json`) |
| pnpm | 12.3.4 | `phil-s-it-consult-landing-page/` pins `packageManager: "pnpm@12.3.4"` and ships `pnpm-lock.yaml`. Install with `corepack enable` |
| PostgreSQL | 13+ | the backend's only datastore |
| Cloudinary account | — | image uploads (optional unless you exercise `POST /api/upload`) |
| Gmail account with an App Password | — | service-request notification emails (optional unless you exercise `POST /api/service_requests`) |

Mixing package managers across folders is intentional only in the sense that it is what the repo contains; do not run `npm install` inside the landing page or you will get a second lockfile.

## 1. Database

```bash
createdb phils_it_consult          # any name; it must match DB_NAME
```

No manual DDL is needed. On boot the backend runs `createTables()`, which creates all ten tables with `CREATE TABLE IF NOT EXISTS`. Because of `IF NOT EXISTS` there is **no migration path** — later schema edits require a manual `ALTER TABLE` or dropping the database (see [05-data-models.md](./05-data-models.md)). There is no seed script either, so after a fresh boot every table is empty and the storefront renders an empty catalogue, no services strip and no New Arrivals section. Insert at least one category, a few products, the two services named exactly `IT Services` and `Creative Studio`, and one `featured_slides` row to see a populated UI.

## 2. Backend

```bash
cd backend
npm install
npm run dev            # nodemon server.js → http://localhost:5000
```

There is **no `start` script** — production would need `node server.js` added to `package.json`. `npm test` deliberately exits 1 (`echo "Error: no test specified" && exit 1`); there are no tests.

Create `backend/.env` (git-ignored by `backend/.gitignore`):

| Variable | Required | Default | Used by |
| --- | --- | --- | --- |
| `PORT` | no | `5000` | `server.js` — the frontend hardcodes 5000, so changing this breaks the SPA |
| `DB_USER` | yes | — | `src/db.js` |
| `DB_HOST` | yes | — | `src/db.js` |
| `DB_NAME` | yes | — | `src/db.js` |
| `DB_PORT` | yes | — | `src/db.js` (5432 for a default install) |
| `DB_PASSWORD` | yes | — | `src/db.js` |
| `JWT_SECRET` | yes | — | `src/controllers/authController.js`, `src/middleware/auth.js`. If unset, `jwt.sign` throws and login 500s |
| `CLOUDINARY_CLOUD_NAME` | for uploads | — | `src/utils/cloudinary.js` |
| `CLOUDINARY_API_KEY` | for uploads | — | `src/utils/cloudinary.js` |
| `CLOUDINARY_API_SECRET` | for uploads | — | `src/utils/cloudinary.js` |
| `EMAIL_USER` | for service requests | — | `src/utils/sendEmail.js`; also the notification recipient |
| `EMAIL_PASS` | for service requests | — | Gmail **App Password**, not the account password |

Example (values are placeholders):

```dotenv
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=phils_it_consult
DB_PORT=5432
DB_PASSWORD=postgres
JWT_SECRET=replace-with-a-long-random-string
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

> **`backend/.env.example` does not exist** (review #26). The table above is reverse-engineered from the source; it is the only record of what the app needs. Committing an `.env.example` with these keys and empty values is the smallest useful fix in the repo.

### Creating an admin

`POST /api/auth/register` always creates a `customer` and there is no promotion endpoint. Register normally, then:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

Log in again afterwards — the role is baked into the JWT at sign time.

## 3. Frontend (storefront)

```bash
cd frontend
npm install
npm run dev            # → http://localhost:5173
```

No env file is used. The API base URL is hardcoded in `src/utils/api.js` to `http://localhost:5000/api` (review #28), so the backend must run on port 5000 and any non-local deployment requires a code change. Vite supports `import.meta.env.VITE_*`; nothing uses it yet.

Other scripts: `npm run build` (see the warning below), `npm run preview`, `npm run lint`.

## 4. Landing page

```bash
cd phil-s-it-consult-landing-page
corepack enable         # once, to get the pinned pnpm
pnpm install
pnpm dev               # → http://localhost:3000
```

No environment variables exist for this project and it makes no network calls. `pnpm build` then `pnpm start` for a production build. Note that `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so a successful build does **not** mean the TypeScript is sound, and `images.unoptimized: true` disables Next's image pipeline.

If you run the storefront and the landing page at the same time, they will both want to be reachable in a browser on different ports (5173 and 3000) — they are unrelated deployments and neither links to the other.

## Running everything at once

```bash
# terminal 1
cd backend && npm run dev
# terminal 2
cd frontend && npm run dev
# terminal 3 (optional — unrelated to the other two)
cd phil-s-it-consult-landing-page && pnpm dev
```

## Current check status

Verified against this commit on Linux:

| Command | Result |
| --- | --- |
| `backend`: `npm install` | OK |
| `backend`: `npm test` | **exits 1 by design** — no test suite |
| `frontend`: `npm install` | OK |
| `frontend`: `npm run lint` | **fails — 15 errors** (unused vars/imports, `react-refresh/only-export-components` on both contexts, `Date.now()` in render, state update inside an effect) |
| `frontend`: `npm run build` | **fails** — `Could not resolve "./pages/services/ItServices"` and `"../../components/SpotlightCard"`; case mismatches that only resolve on case-insensitive macOS/Windows filesystems. Any Linux CI or Docker build fails here |
| `landing page`: `pnpm build` | not run here; `ignoreBuildErrors` means type errors would not surface anyway |

These are documented, not fixed, per the scope of this work. `npm run build` failing means **the storefront cannot currently be deployed from a Linux runner** — fixing the two import casings is the prerequisite for any CI.

## Other repository-hygiene notes

- No CI workflow, no Dockerfile, no `docker-compose.yml`.
- No root `README.md`; `frontend/README.md` is the stock Vite template text.
- No linting or formatting config for `backend/` at all (the frontend's `eslint.config.js` covers only `frontend/`).
- No pre-commit hooks (`.pre-commit-config.yaml` and `.husky/` are absent).
- The root `.gitignore` begins with a UTF-8 BOM, which makes its first line (`frontend/node_modules/`) a literal pattern that never matches. It happens not to matter because each project has its own `.gitignore` that covers `node_modules`.
- `backend/.gitignore` ignores `.env`; the landing page ignores `.env*.local`; `frontend/.gitignore` ignores neither, so **a `.env` added to `frontend/` would be committed**.
