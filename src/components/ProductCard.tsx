import { Link } from "react-router-dom"
import { FavouriteButton } from "@/components/FavouriteButton"
import { Star } from "lucide-react"
import type { Product } from "@/types/product"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/utils/format"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Derive a stock label + colour from the stock count.
  const stockLabel =
    product.stock === 0 ? "Out of Stock" : product.stock < 10 ? "Low Stock" : "In Stock"
  const stockVariant =
    product.stock === 0 ? "destructive" : product.stock < 10 ? "secondary" : "default"

  return (
    <Card className="flex flex-col overflow-hidden" data-testid={`product-card-${product.id}`}>
      <div className="relative aspect-square bg-white">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain p-4"
        />
        <div className="absolute right-2 top-2">
          <FavouriteButton productId={product.id} productTitle={product.title} />
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <h3 className="line-clamp-2 font-semibold leading-tight">{product.title}</h3>

        <div className="flex items-center gap-1 text-sm" aria-label={`Rating ${product.rating.toFixed(2)} out of 5`}>
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
          <span>{product.rating.toFixed(2)}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          <Badge variant={stockVariant}>{stockLabel}</Badge>
        </div>
      </CardContent>

      <CardFooter>
        <Link
          to={`/products/${product.id}`}
          data-testid={`view-details-${product.id}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}