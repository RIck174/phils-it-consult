# Phil's-IT Consult — documentation

Documentation for the three applications in this repository. Written against commit `2f5e264` (`main`).

| Document | Contents |
| --- | --- |
| [01-architecture.md](./01-architecture.md) | How `backend/`, `frontend/` and `phil-s-it-consult-landing-page/` relate, request flow, and the open decision about the duplicated IT Services page |
| [02-backend-api.md](./02-backend-api.md) | Every route file: endpoint, method, auth, request/response shape, controller behaviour |
| [03-frontend.md](./03-frontend.md) | Every page and component: purpose, props, state |
| [04-dependency-map.md](./04-dependency-map.md) | Per-page/component import tree, backend endpoints called, fields expected, and missing files/fields/routes |
| [05-data-models.md](./05-data-models.md) | Tables, columns, relationships, and where the model is incomplete |
| [06-setup.md](./06-setup.md) | Running all three apps locally, and the full env var list (no `.env.example` exists yet) |
| [07-implementation-suggestions.md](./07-implementation-suggestions.md) | Options with trade-offs for each stub/gap — approaches only, no code |

## Reading order

New to the repo: 01 → 06 → 02 → 05. Picking up feature work: 04 → 07.

## Conventions used here

- **Status callouts** — `NOT IMPLEMENTED`, `BROKEN`, `UNUSED`, `MISSING` mark things that do not work today rather than things that are merely unfinished by design.
- Findings referenced as *review #N* come from the code review of the same commit; the numbering is preserved so the two documents cross-reference.
- These documents describe **what the code does today**, including its bugs. They are not a specification of intended behaviour.

## Current state in one paragraph

The backend is a functioning Express + PostgreSQL REST API covering auth, products, categories, cart, orders, services, service requests, featured slides and Cloudinary uploads. The Vite/React storefront consumes the read-only product, category, service and featured-slide endpoints; it does **not** use the auth, cart or order endpoints — login, admin and checkout are unbuilt (`Auth`, `Admin` and `Services` index pages are one-line stubs), and the cart lives only in React state. The Next.js landing page is a standalone marketing page that duplicates a page already present in the storefront and submits its contact form nowhere. The storefront also does not currently build on a case-sensitive filesystem (see [01](./01-architecture.md#known-blockers)).
