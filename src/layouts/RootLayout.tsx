import { Link, Outlet } from "react-router-dom"
import { ThemeToggle } from "@/components/ThemeToggle"

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/products" className="whitespace-nowrap text-lg font-bold sm:text-xl">
            Product Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/products"
              className="whitespace-nowrap rounded text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Products
            </Link>
            <Link
              to="/products/add"
              className="whitespace-nowrap rounded text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Add Product
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout