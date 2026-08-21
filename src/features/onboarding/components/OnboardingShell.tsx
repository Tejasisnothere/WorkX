import { useEffect, type ReactNode } from "react"
import { Link, useNavigate } from "react-router"

import { Logo } from "../../../shared/components/Logo"
import { cn } from "../../../shared/lib/cn"

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => unknown
}

export function OnboardingShell({ step, total = 3, eyebrow, title, subtitle, children, footer, autoAdvanceTo }: { step: number; total?: number; eyebrow: string; title: ReactNode; subtitle: string; children: ReactNode; footer: ReactNode; autoAdvanceTo?: string }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!autoAdvanceTo) return

    const timeout = window.setTimeout(() => {
      const documentWithTransitions = document as ViewTransitionDocument
      if (documentWithTransitions.startViewTransition) {
        documentWithTransitions.startViewTransition(() => navigate(autoAdvanceTo))
      } else {
        navigate(autoAdvanceTo)
      }
    }, 6000)
    return () => window.clearTimeout(timeout)
  }, [autoAdvanceTo, navigate])

  return (
    <main className="min-h-screen bg-background text-text">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <Link to="/language" className="text-sm font-semibold text-text-muted hover:text-text">Skip</Link>
      </header>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 lg:grid-cols-2 lg:gap-16 lg:pb-24">
        <div>
          <span className="inline-flex rounded-full bg-primary-light px-3 py-1 text-xs font-bold uppercase tracking-wide text-text">{eyebrow}</span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            {footer}
            <div className="flex items-center gap-2" aria-label={`Step ${step} of ${total}`}>
              {Array.from({ length: total }).map((_, index) => <span key={index} className={cn("h-2 rounded-full transition-all", index + 1 === step ? "w-8 bg-primary-dark" : "w-2 bg-border")} />)}
              <span className="ml-2 text-sm text-text-muted">{step} of {total}</span>
            </div>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </main>
  )
}
