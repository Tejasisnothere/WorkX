import type { MouseEvent, ReactNode } from "react"
import { Link, useNavigate } from "react-router"

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => unknown
}

interface OnboardingNextLinkProps {
  to: string
  className: string
  children: ReactNode
}

export function OnboardingNextLink({ to, className, children }: OnboardingNextLinkProps) {
  const navigate = useNavigate()

  function animateNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return
    event.preventDefault()

    const documentWithTransitions = document as ViewTransitionDocument
    if (documentWithTransitions.startViewTransition) {
      documentWithTransitions.startViewTransition(() => navigate(to))
    } else {
      navigate(to)
    }
  }

  return <Link className={className} onClick={animateNavigation} to={to}>{children}</Link>
}
