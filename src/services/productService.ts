import type { Product, ProductsResponse, NewProduct } from "@/types/product"

const BASE_URL = "https://dummyjson.com"

// Options we can pass when fetching the product list.
export interface GetProductsParams {
  limit?: number
  skip?: number
  search?: string
  category?: string
  sortBy?: "price" | "rating" | "title"
  order?: "asc" | "desc"
}

// A small helper: fetches JSON and throws a clear error if the request fails.
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

// GET /products  — also handles search, category filter, sorting and pagination.
export async function getProducts(
  params: GetProductsParams = {}
): Promise<ProductsResponse> {
  const { limit = 12, skip = 0, search, category, sortBy, order } = params

  // Build the query string (?limit=..&skip=..&sortBy=..&order=..)
  const query = new URLSearchParams()
  query.set("limit", String(limit))
  query.set("skip", String(skip))
  if (sortBy) query.set("sortBy", sortBy)
  if (order) query.set("order", order)

  // DummyJSON uses DIFFERENT paths for search vs category vs all products.
  let path = "/products"
  if (search) {
    path = "/products/search"
    query.set("q", search)
  } else if (category) {
    path = `/products/category/${encodeURIComponent(category)}`
  }

  return fetchJson<ProductsResponse>(`${BASE_URL}${path}?${query.toString()}`)
}

// GET /products/:id — a single product's full details.
export async function getProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`)
}

// GET /products/category-list — array of category names (for the filter dropdown).
export async function getCategories(): Promise<string[]> {
  return fetchJson<string[]>(`${BASE_URL}/products/category-list`)
}

// POST /products/add — submit a new product (DummyJSON echoes it back with an id).
export async function addProduct(product: NewProduct): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
}