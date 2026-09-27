import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "@/types/product"
import { getProducts, getCategories } from "@/services/productService"
import type { GetProductsParams } from "@/services/productService"

export interface Filters {
  search: string
  category: string // "" = all categories
  sortBy: "" | "price" | "rating" | "title"
  order: "asc" | "desc"
  page: number // 0-based
}

interface ProductsState {
  items: Product[]
  total: number
  categories: string[]
  addedProducts: Product[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  filters: Filters
}

const initialState: ProductsState = {
  items: [],
  total: 0,
  categories: [],
  addedProducts: [],
  status: "idle",
  error: null,
  filters: { search: "", category: "", sortBy: "", order: "asc", page: 0 },
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: GetProductsParams) => await getProducts(params)
)

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => await getCategories()
)

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Changing a filter always resets to page 0 (so you don't land on an empty page).
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload
      state.filters.page = 0
    },
    setCategory(state, action: PayloadAction<string>) {
      state.filters.category = action.payload
      state.filters.page = 0
    },
    setSort(
      state,
      action: PayloadAction<{ sortBy: Filters["sortBy"]; order: Filters["order"] }>
    ) {
      state.filters.sortBy = action.payload.sortBy
      state.filters.order = action.payload.order
      state.filters.page = 0
    },
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload
    },
    addLocalProduct(state, action: PayloadAction<Product>) {
      state.addedProducts.unshift(action.payload) // put newest first
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.products
        state.total = action.payload.total
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "Failed to load products"
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
  },
})

export const { setSearch, setCategory, setSort, setPage, addLocalProduct } =
  productsSlice.actions
export default productsSlice.reducer
