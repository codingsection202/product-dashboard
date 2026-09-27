import { Button } from "@/components/ui/button"

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Button
        variant="outline"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        data-testid="prev-page"
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground" data-testid="page-info">
        Page {page + 1} of {totalPages}
      </span>
      <Button
        variant="outline"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        data-testid="next-page"
      >
        Next
      </Button>
    </div>
  )
}