import { lazy, Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import RootLayout from "@/layouts/RootLayout"

// Each page is loaded on-demand (code-splitting).
const ProductList = lazy(() => import("@/pages/ProductList"))
const ProductDetails = lazy(() => import("@/pages/ProductDetails"))
const AddProduct = lazy(() => import("@/pages/AddProduct"))

function App() {
  return (
    <BrowserRouter>
      {/* Suspense shows a fallback while a page chunk is being fetched */}
      <Toaster />
      <Suspense
        fallback={<div className="p-8 text-center text-muted-foreground">Loading…</div>}
      >
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="*" element={<div className="p-8">Page not found</div>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App