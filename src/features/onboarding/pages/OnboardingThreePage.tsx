import {
  ArrowRight,
  Bookmark,
  Check,
  Languages,
  WifiOff,
} from "lucide-react"

import { Link } from "react-router"

import { Card } from "../../../shared/components/ui/Card"

import { OnboardingNextLink } from "../components/OnboardingNextLink"

import { OnboardingShell } from "../components/OnboardingShell"

import { LANGUAGES } from "../data/catalog"

const offlineItems = ["Saved profile", "Saved jobs", "Previous requests"]

export function OnboardingThreePage() {
  return (
    <OnboardingShell
      autoAdvanceTo="/onboarding"
      step={3}
      eyebrow="Offline + multilingual"
      title="Work for everyone. Anywhere."
      subtitle="WorkX is built for low-end phones, patchy networks and many languages — so nobody is left out of local employment."
      footer={
        <div className="flex flex-col items-center gap-3">
          <OnboardingNextLink
            to="/language"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-text transition-colors hover:bg-primary-dark"
          >
            Get started
            <ArrowRight className="size-5" />
          </OnboardingNextLink>

          <p className="text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-primary-dark underline-offset-4 transition-colors hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="space-y-4">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary-dark">
            <WifiOff className="size-5" />
          </span>

          <div>
            <h3 className="text-lg font-bold">Offline</h3>
            <p className="mt-1 text-sm text-text-muted">
              Important information stays on your phone when the connection
              drops.
            </p>
          </div>

          <ul className="space-y-2">
            {offlineItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[15px] font-semibold"
              >
                <Check className="size-4 text-success" />
                {item}
              </li>
            ))}
          </ul>

          <p className="inline-flex items-center gap-2 text-sm text-text-muted">
            <Bookmark className="size-4" />
            Syncs again once you're back online
          </p>
        </Card>

        <Card className="space-y-4">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary-dark">
            <Languages className="size-5" />
          </span>

          <div>
            <h3 className="text-lg font-bold">Multilingual</h3>
            <p className="mt-1 text-sm text-text-muted">
              Read, speak and search in the language you're comfortable with.
            </p>
          </div>

          <ul className="space-y-2">
            {LANGUAGES.map((language) => (
              <li
                key={language.code}
                className="rounded-xl border border-border px-3 py-2.5 text-[15px] font-semibold"
              >
                {language.native}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </OnboardingShell>
  )
}