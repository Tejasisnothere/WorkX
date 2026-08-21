import type { ReactNode } from "react"

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  )
}
