export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string // optional: some products don't have a brand
  thumbnail: string // small image used in the list
  images: string[] // full-size images used on the details page
  availabilityStatus?: string // e.g. "In Stock" / "Low Stock" / "Out of Stock"
}

// The shape returned by GET /products (a paginated list).
export interface ProductsResponse {
  products: Product[]
  total: number // total number of products available (for pagination)
  skip: number // how many were skipped
  limit: number // how many per page
}
// The data we SEND to POST /products/add (from the Add Product form).
export interface NewProduct {
  title: string
  description: string
  category: string
  price: number
  stock: number
  brand: string
  thumbnail: string // the product image URL from the form
}