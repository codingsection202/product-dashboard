import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setCategory, setSort } from "@/store/productsSlice"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SORT_OPTIONS = [
  { value: "default", label: "Sort: Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
]

export function ProductFilters() {
  const dispatch = useAppDispatch()
  const { categories, filters } = useAppSelector((s) => s.products)

  const currentSort = filters.sortBy === "" ? "default" : `${filters.sortBy}-${filters.order}`

  const handleSort = (value: string | null) => {
    if (!value || value === "default") {
      dispatch(setSort({ sortBy: "", order: "asc" }))
      return
    }
    const [sortBy, order] = value.split("-") as ["price" | "rating", "asc" | "desc"]
    dispatch(setSort({ sortBy, order }))
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Category filter */}
      <Select
        value={filters.category || "all"}
        onValueChange={(v) => dispatch(setCategory(v && v !== "all" ? v : ""))}
      >
        <SelectTrigger className="w-full sm:w-48" aria-label="Filter by category" data-testid="category-filter">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c} className="capitalize">
              {c.replace(/-/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={currentSort} onValueChange={handleSort}>
        <SelectTrigger className="w-full sm:w-48" aria-label="Sort products" data-testid="sort-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}