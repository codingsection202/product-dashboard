import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm,type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchCategories, addLocalProduct } from "@/store/productsSlice"
import { addProduct } from "@/services/productService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const productSchema = z.object({
  title: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative"),
  brand: z.string().min(1, "Brand is required"),
  thumbnail: z.string().url("Must be a valid image URL"),
})

type ProductFormValues = z.infer<typeof productSchema>

function AddProduct() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const categories = useAppSelector((s) => s.products.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      brand: "",
      thumbnail: "",
    },
  })

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const created = await addProduct(values)
      dispatch(
        addLocalProduct({
          id: created.id,
          title: values.title,
          description: values.description,
          category: values.category,
          price: values.price,
          discountPercentage: 0,
          rating: 0,
          stock: values.stock,
          brand: values.brand,
          thumbnail: values.thumbnail,
          images: [values.thumbnail],
        })
      )
      toast.success("Product added successfully!")
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add product")
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Add Product</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Wireless Headphones" {...field} data-testid="input-title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Describe the product…" {...field} data-testid="input-description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="input-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c.replace(/-/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} data-testid="input-price" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} data-testid="input-stock" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Sony" {...field} data-testid="input-brand" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product image URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://…" {...field} data-testid="input-image" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting} data-testid="submit-button">
              {isSubmitting ? "Adding…" : "Add Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset()}
              data-testid="reset-button"
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AddProduct