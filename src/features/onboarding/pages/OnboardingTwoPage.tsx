import { ArrowRight, MapPin, Navigation, Users } from "lucide-react"
import { Card } from "../../../shared/components/ui/Card"
import { OnboardingNextLink } from "../components/OnboardingNextLink"
import { OnboardingShell } from "../components/OnboardingShell"
import { nearbyDemand } from "../data/nearbyDemand"

export function OnboardingTwoPage() {
  return <OnboardingShell autoAdvanceTo="/onboarding/access" step={2} eyebrow="Local employment" title="Find help close to home." subtitle="WorkX keeps work inside the community. Customers see skilled people a few kilometres away, and workers get opportunities they can actually reach." footer={<OnboardingNextLink to="/onboarding/access" className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-text transition-colors hover:bg-primary-dark">Next <ArrowRight className="size-5" /></OnboardingNextLink>}>
    <Card className="space-y-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary-dark"><Navigation className="size-5" /></span><div><p className="font-bold">Nearby opportunities</p><p className="text-sm text-text-muted">Vellore, Tamil Nadu</p></div></div><ul className="divide-y divide-border">{nearbyDemand.map((item) => <li key={item.profession} className="flex items-center justify-between gap-4 py-3.5"><span className="inline-flex items-center gap-3 font-semibold"><MapPin className="size-5 text-primary-dark" />{item.profession}</span><span className="text-[15px] font-semibold text-text-muted">{item.distance}</span></li>)}</ul><div className="flex items-start gap-3 rounded-xl bg-primary-soft p-4"><Users className="mt-0.5 size-5 shrink-0 text-primary-dark" /><p className="text-[15px]">Work stays in the community — every job matched nearby means local income and faster help.</p></div></Card>
  </OnboardingShell>
}
