import { PackageOpen } from "lucide-react"

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = "No products found." }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16 text-center"
      data-testid="empty-state"
    >
      <PackageOpen className="h-12 w-12 text-muted-foreground" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
    </div>
  )
}