# E-Comus Storefront

![HTML5](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white) ![CSS3](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white) ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)

E-Comus Storefront is a React + Tailwind CSS + Axios + TanStack Query e-commerce client built against the [E-Comus Open REST API](https://e-commas-apis-production-e0f8.up.railway.app/api-docs/), letting users browse products, manage a persistent cart, and check out, all from a clean and intuitive storefront.

**Live Demo:** https://e-commerce-web-client-blond.vercel.app/

## Table of Contents

- [Tech stack](#tech-stack)
- [Setup](#setup)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [State management approach](#state-management-approach)
- [Guest identity / cart persistence](#guest-identity--cart-persistence)
- [Known documentation discrepancies / assumptions](#known-documentation-discrepancies--assumptions)
- [Codebase walkthrough talking points](#codebase-walkthrough-talking-points)
- [Deployment](#deployment)

## Tech stack

- **React 19** (function components + hooks), bootstrapped with **Vite**
- **React Router** for client-side routing
- **Tailwind CSS v4** for all styling (via `@tailwindcss/vite`, no hand-written CSS files beyond a minimal global reset in `src/index.css`)
- **Axios** — one centralized instance (`src/api/client.js`) with request/response interceptors
- **TanStack Query** (`@tanstack/react-query`) for every server-state read/write
- **react-hot-toast** for success/error feedback

## Setup

```bash
npm install
cp .env.example .env   # base URL is already filled in, but you can point it elsewhere
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the E-Comus API (e.g. `https://e-commas-apis-production-e0f8.up.railway.app/api`) |

No API key is required — the E-Comus API is fully open.

## Project structure

Organized by layer (chosen over by-feature since the app is small enough that a layer split keeps related code easy to find without deep nesting):

```
src/
  api/         # Axios instance + one module per resource (products, categories, cart, orders)
  hooks/       # useQuery/useMutation hooks — the only place components touch the API layer
  components/  # Reusable design-system pieces (Button, Input, Card, Skeleton, Navbar, ProductCard...)
  pages/       # Route-level views
  utils/       # formatPrice, guest user id, etc.
```

## State management approach

- **Server state** (products, categories, cart, orders) lives only in the TanStack Query
  cache, reached through the hooks in `src/hooks`. Components never copy this data into
  `useState`.
- **UI state** (search input text before debounce, selected category, current page,
  selected variant, checkout form fields, toast visibility) lives in local component state.
- Cart mutations (`useUpdateCartItem`, `useRemoveCartItem`) use **optimistic updates**:
  the cache is patched immediately via `onMutate`, rolled back on error via the snapshot
  returned from `onMutate`, and reconciled with the server via `invalidateQueries` in
  `onSettled`.

## Guest identity / cart persistence

The E-Comus API scopes cart and orders by `userId` but doesn't require authentication.
To satisfy "cart must survive a refresh" without forcing a login, the app mints a random
guest id on first visit (`src/utils/guestUser.js`), stores it in `localStorage`, and the
Axios request interceptor in `src/api/client.js` attaches it to every cart/order request
automatically. This means no component or hook ever has to think about the user id.

## Known documentation discrepancies / assumptions

The live Swagger UI at `/api-docs` is JS-rendered and the project brief explicitly says
the live API is the source of truth, so the data layer was built to be defensive rather
than assuming one exact response shape:

- Every read function (`fetchProducts`, `fetchCart`, `fetchOrders`, etc.) unwraps the
  response with a chain of fallbacks (e.g. `data?.data ?? data?.products ?? data?.items ?? []`)
  so a slightly different envelope shape doesn't break the UI.
- Field names that commonly vary between API implementations (`id` vs `_id`, `name` vs
  `title`, `price` vs `basePrice`) are read with optional chaining and fallbacks throughout
  the components.
- **Before you submit:** open `/api-docs` in your browser, try each endpoint with "Try it
  out", and confirm the request/response field names against what's in `src/api/*.js` and
  the pages that consume them. If anything differs, it's a small, localized fix (the
  unwrapping/fallback pattern above means you're usually adding one more `??` fallback,
  not rewriting a page). Document anything you changed here, in this section, with a short
  before/after note — that's exactly what the assignment brief asks for.

## Codebase walkthrough talking points

1. **Folder structure** — layer-based (`api/ hooks/ components/ pages/ utils/`); explain
   why (small app, layer split keeps things flat).
2. **Axios + TanStack Query wiring** — show `src/api/client.js` (interceptors) next to
   `src/hooks/useProducts.js` (a `useQuery`) and `src/hooks/useCart.js` (a `useMutation`
   with optimistic update + invalidation).
3. **Server vs UI state** — point to `ProductsPage.jsx`: `searchInput`/`category`/`page`
   are `useState`; the actual product list comes from `useProducts(...)` and is never
   stored locally.
4. **One challenge** — keeping the cart UI responsive despite network latency, solved
   with optimistic updates + rollback in `useCart.js`.

## Deployment

Deploy the `dist/` output (after `npm run build`) to Vercel or Netlify. Set
`VITE_API_BASE_URL` as an environment variable in the hosting dashboard — don't hard-code it.

## Live links

- GitHub repo: _add link_
- Deployed app: https://e-commerce-web-client-blond.vercel.app/
