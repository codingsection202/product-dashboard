# Product Management Dashboard

A responsive product management dashboard built with React, TypeScript and the [DummyJSON Products API](https://dummyjson.com/products). Users can browse, search, filter, sort, paginate, view and add products.

## 🚀 Live Demo
> **[https://product-dashboard-fawn-rho.vercel.app](https://product-dashboard-fawn-rho.vercel.app)**

## ✨ Features

**Core**
- Product listing with responsive card grid (image, name, category, price, stock status, rating)
- Search by name, filter by category, sort by price/rating
- API-based pagination
- Product details page (`/products/:id`) with discount, brand, stock, description
- Add Product form with full type-safe validation
- Loading skeletons, empty state, error state with **Retry**

**Performance**
- **Debounced search** (400ms) — fewer API calls, no typing flicker
- **Lazy-loaded routes** (`React.lazy` + `Suspense`) — smaller initial bundle

**Bonus**
- Toast notifications (Sonner)
- Dark / light theme toggle (persisted in `localStorage`)
- Favourite products (persisted in `localStorage`)

## 🛠️ Technology Choices

| Tech | Why |
|------|-----|
| **React + Vite** | Fast dev server & optimized builds |
| **TypeScript** | Type-safe components, forms and API models |
| **Tailwind CSS + shadcn/ui** | Rapid, consistent, accessible UI |
| **Redux Toolkit** | Predictable global state (products, filters, favourites) with async thunks |
| **React Router** | Client-side routing for list/details/add |
| **React Hook Form + Zod** | Type-safe forms with schema-based validation |
| **Sonner** | Lightweight toast notifications |

## 📦 Setup Instructions

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone the repo
git clone <https://github.com/codingsection202/product-dashboard.git>
cd product-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# open http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview the production build
npm run preview
```

## 🗂️ Project Structure

```
src/
├── components/      # Reusable UI (ProductCard, SearchBar, Pagination, states…)
│   └── ui/          # shadcn/ui primitives
├── pages/           # Route screens (ProductList, ProductDetails, AddProduct)
├── layouts/         # RootLayout (header + nav + <Outlet/>)
├── services/        # API layer (productService.ts) — all DummyJSON calls
├── store/           # Redux Toolkit (store, slices, typed hooks)
├── hooks/           # Custom hooks (useDebounce)
├── types/           # Shared TypeScript types (Product, etc.)
└── utils/           # Helpers (formatPrice)
```

**Architecture principle:** UI (components/pages) → asks the **store** → which calls **services** → which hit the **API**, all described by shared **types**. One-directional, predictable data flow.

## 🔄 State Management Approach

- **Redux Toolkit** for app-wide state: product list, `total`, filters (search/category/sort/page), locally-added products, and favourites. Chosen because this state is **shared across screens** and benefits from a predictable structure + async thunks + DevTools.
- **Local component state** where appropriate: the product details page fetches its own single product (used by only that screen), and the search input holds its instant value before debouncing.
- **React Context** for the theme (simple, rarely-changing global UI state).

## ⚡ Performance Optimizations

1. **Debounced search** — the search input updates instantly, but the API call only fires 400ms after the user stops typing. This avoids a request per keystroke and prevents out-of-order (race) results.
2. **Lazy-loaded routes** — each page is code-split with `React.lazy` and loaded on demand via `<Suspense>`, reducing the initial JavaScript bundle and speeding up first load.

_(Also uses native `loading="lazy"` on product images.)_

## 📝 Assumptions

- New products are stored **locally** (Redux) since DummyJSON doesn't persist `POST /products/add` — this matches the assignment ("product may be added locally").
- Locally-added products appear at the top of page 1 only when no search/category filter is active.
- Category slugs from the API are displayed with hyphens replaced by spaces.

## ⚠️ Known Limitations

- DummyJSON uses **separate endpoints** for search vs category, so they can't be combined — when a search term is active, the category filter is ignored (search takes priority).
- Locally-added products are **not persisted** across full page refreshes (they live in Redux memory). Favourites and theme *are* persisted via `localStorage`.
- Added products won't appear on a real backend (API is read-only for new items).

## ⏱️ Approximate Time Spent

~8 hours (setup, core features, performance, bonuses, testing, documentation).

## 📄 License
For assignment purposes
