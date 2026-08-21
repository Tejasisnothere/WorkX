import { ArrowRight, Sparkles, User, Wrench } from "lucide-react"
import { Badge } from "../../../shared/components/ui/Badge"
import { Card } from "../../../shared/components/ui/Card"
import { OnboardingNextLink } from "../components/OnboardingNextLink"
import { OnboardingShell } from "../components/OnboardingShell"

export function OnboardingOnePage() {
  return <OnboardingShell autoAdvanceTo="/onboarding/local" step={1} eyebrow="AI skill matching" title={<>Your skills.<br />The right opportunity.</>} subtitle="Tell WorkX what you need in plain words. Our AI understands the requirement, pulls out the profession and skills, and matches the worker who fits best." footer={<OnboardingNextLink to="/onboarding/local" className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-text transition-colors hover:bg-primary-dark">Next <ArrowRight className="size-5" /></OnboardingNextLink>}>
    <div className="space-y-3"><Card className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-text-muted">Customer says</p><p className="mt-2 flex items-start gap-3 text-[17px] font-semibold"><User className="mt-0.5 size-5 shrink-0 text-primary-dark" />“I need someone to fix my fan.”</p></Card><Flow /><Card className="border-primary-light bg-primary-soft p-5"><Badge><Sparkles className="size-4" />AI detects</Badge><dl className="mt-3 grid gap-3 sm:grid-cols-2"><div><dt className="text-xs font-bold uppercase text-text-muted">Profession</dt><dd className="mt-1 font-bold">Electrician</dd></div><div><dt className="text-xs font-bold uppercase text-text-muted">Skill</dt><dd className="mt-1 font-bold">Fan Repair</dd></div></dl></Card><Flow /><Card className="flex items-center justify-between gap-4 p-5"><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-primary-light"><Wrench className="size-6" /></span><div><p className="font-bold">Ravi Kumar</p><p className="text-sm text-text-secondary">Electrician</p><p className="mt-1 text-sm text-text-secondary">Fan Repair · House Wiring</p></div></div><div className="text-right"><p className="text-2xl font-extrabold text-primary-dark">94%</p><p className="text-xs font-bold uppercase text-text-muted">Match</p></div></Card></div>
  </OnboardingShell>
}

function Flow() { return <div className="flex justify-center"><span className="h-6 w-px bg-border" aria-hidden="true" /></div> }
