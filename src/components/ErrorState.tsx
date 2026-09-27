import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export function ErrorState({ message = "Something went wrong.", onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16 text-center"
      role="alert"
      data-testid="error-state"
    >
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <p className="text-lg font-medium">{message}</p>
      <Button onClick={onRetry} data-testid="retry-button">
        Try Again
      </Button>
    </div>
  )
}