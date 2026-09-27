import { Heart } from "lucide-react"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { toggleFavourite } from "@/store/favouritesSlice"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FavouriteButtonProps {
  productId: number
  productTitle: string
}

export function FavouriteButton({ productId, productTitle }: FavouriteButtonProps) {
  const dispatch = useAppDispatch()
  const isFavourite = useAppSelector((s) => s.favourites.ids.includes(productId))

  const handleClick = () => {
    dispatch(toggleFavourite(productId))
    toast.success(
      isFavourite
        ? `Removed "${productTitle}" from favourites`
        : `Added "${productTitle}" to favourites`
    )
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      onClick={handleClick}
      aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={isFavourite}
      data-testid={`favourite-button-${productId}`}
    >
      <Heart className={cn("h-4 w-4", isFavourite && "fill-red-500 text-red-500")} />
    </Button>
  )
}