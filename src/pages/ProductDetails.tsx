import { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Star } from "lucide-react"
import type { Product } from "@/types/product"
import { getProductById } from "@/services/productService"
import { formatPrice } from "@/utils/format"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ErrorState"

function ProductDetails() {
  const { id } = useParams() // reads ":id" from the URL, e.g. "/products/5" -> "5"
  const [product, setProduct] = useState<Product | null>(null)
  const [status, setStatus] = useState<"loading" | "succeeded" | "failed">("loading")
  const [error, setError] = useState<string | null>(null)

  // Reusable loader — used on mount AND by the Retry button.
  const loadProduct = useCallback(() => {
    if (!id) return
    setStatus("loading")
    setError(null)
    getProductById(Number(id))
      .then((data) => {
        setProduct(data)
        setStatus("succeeded")
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load product")
        setStatus("failed")
      })
  }, [id])

  // Re-fetch whenever the id in the URL changes.
  useEffect(() => {
    loadProduct()
  }, [loadProduct])

  return (
    <div>
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-2 rounded text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      {status === "loading" && <ProductDetailsSkeleton />}
      {status === "failed" && <ErrorState message={error ?? undefined} onRetry={loadProduct} />}
      {status === "succeeded" && product && <ProductDetailsView product={product} />}
    </div>
  )
}

// --- Presentational sub-components (kept here since they're only used on this page) ---

function ProductDetailsView({ product }: { product: Product }) {
  const hasDiscount = product.discountPercentage > 0
  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100
  const stockLabel =
    product.stock === 0 ? "Out of Stock" : product.stock < 10 ? "Low Stock" : "In Stock"
  const stockVariant =
    product.stock === 0 ? "destructive" : product.stock < 10 ? "secondary" : "default"

  return (
    <div className="grid gap-8 md:grid-cols-2" data-testid="product-details">
      <div className="overflow-hidden rounded-lg border bg-white">
        <img
          src={product.images[0] ?? product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain p-6"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {product.category.replace(/-/g, " ")}
          </p>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          {product.brand && <p className="text-sm text-muted-foreground">by {product.brand}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{product.rating.toFixed(2)}</span>
          <Badge variant={stockVariant} className="ml-2">
            {stockLabel}
          </Badge>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">
            {formatPrice(hasDiscount ? discountedPrice : product.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
              <Badge variant="destructive">-{Math.round(product.discountPercentage)}%</Badge>
            </>
          )}
        </div>

        <p className="leading-relaxed text-muted-foreground">{product.description}</p>

        <dl className="grid grid-cols-2 gap-3 border-t pt-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Stock</dt>
            <dd className="font-medium">{product.stock} units</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Category</dt>
            <dd className="font-medium capitalize">{product.category.replace(/-/g, " ")}</dd>
          </div>
          {product.brand && (
            <div>
              <dt className="text-muted-foreground">Brand</dt>
              <dd className="font-medium">{product.brand}</dd>
            </div>
          )}
          {product.availabilityStatus && (
            <div>
              <dt className="text-muted-foreground">Availability</dt>
              <dd className="font-medium">{product.availabilityStatus}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}

function ProductDetailsSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}

export default ProductDetails