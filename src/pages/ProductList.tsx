import { useCallback, useEffect,useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchProducts, fetchCategories, setSearch, setPage } from "@/store/productsSlice"
import { ProductCard } from "@/components/ProductCard"
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton"
import { SearchBar } from "@/components/SearchBar"
import { ProductFilters } from "@/components/ProductFilters"
import { Pagination } from "@/components/Pagination"
import { EmptyState } from "@/components/EmptyState"
import { ErrorState } from "@/components/ErrorState"

const PAGE_SIZE = 12

function ProductList() {
  const dispatch = useAppDispatch()
  const { items, total, status, error, filters,addedProducts  } = useAppSelector((s) => s.products)

  // Show locally-added products at the top, but only on page 1 with no active search/category
  // (so they don't confuse filtered/sorted results).
  const showLocal = filters.page === 0 && !filters.search && !filters.category
  const displayItems = showLocal ? [...addedProducts, ...items] : items

  // Local input state for the search box (updates instantly as you type)...
  const [searchInput, setSearchInput] = useState(filters.search)
  // ...but only push the value into Redux (and trigger a fetch) after typing pauses.
  const debouncedSearch = useDebounce(searchInput, 400)

  useEffect(() => {
    dispatch(setSearch(debouncedSearch))
  }, [debouncedSearch, dispatch])

  // Load categories once (for the dropdown).
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // A single reusable "load" function — used by the effect AND the Retry button.
  const loadProducts = useCallback(() => {
    dispatch(
      fetchProducts({
        limit: PAGE_SIZE,
        skip: filters.page * PAGE_SIZE,
        search: filters.search || undefined,
        category: filters.category || undefined,
        sortBy: filters.sortBy || undefined,
        order: filters.order,
      })
    )
  }, [dispatch, filters.search, filters.category, filters.sortBy, filters.order, filters.page])

  // Re-fetch whenever the filters (and therefore loadProducts) change.
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Products</h1>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchBar value={searchInput} onChange={setSearchInput}  />
        <ProductFilters />
      </div>

      {/* LOADING → skeleton grid */}
      {status === "loading" && (
        <div role="status"
          aria-label="Loading products"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ERROR → message + retry */}
      {status === "failed" && (
        <ErrorState message={error ?? undefined} onRetry={loadProducts} />
      )}

      {/* EMPTY → friendly message */}
      {status === "succeeded" && displayItems.length === 0 && <EmptyState />}

      {/* SUCCESS → grid + pagination */}
      {status === "succeeded" && displayItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            page={filters.page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </>
      )}
    </div>
  )
}

export default ProductList