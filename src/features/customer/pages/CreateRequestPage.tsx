import { useState } from "react"

import type { FormEvent } from "react"

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Mic,
  Sparkles,
  WandSparkles,
} from "lucide-react"

import { Link, useNavigate } from "react-router"

import { readStorage, writeStorage } from "../../../shared/lib/storage"

import type { JobRequest } from "../../../shared/types/domain"

const professions = [
  "Electrical",
  "Plumbing",
  "Construction",
  "Tailoring",
  "Farming",
  "Cooking",
  "Driving",
  "Healthcare",
]

export function CreateRequestPage() {
  const navigate = useNavigate()

  const [description, setDescription] = useState("")

  const [profession, setProfession] = useState("Electrical")

  const [skills, setSkills] = useState("Wiring, Fan Repair")

  const [location, setLocation] = useState("Vellore")

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const requiredSkills = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)

    const keywords = [
      ...requiredSkills.map((skill) => skill.toLowerCase()),
      ...description
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 3),
    ]

    const request: JobRequest = {
      id: crypto.randomUUID(),
      customerId: "demo-customer",
      description,
      profession,
      requiredSkills,
      keywords,
      location,
      createdAt: new Date().toISOString(),
      status: "open",
    }

    const existingRequests = readStorage<JobRequest[]>(
      "workx:requests",
      [],
    )

    writeStorage(
      "workx:requests",
      [request, ...existingRequests],
    )

    writeStorage("workx:last-request", request)

    navigate("/customer/matches")
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Page heading */}
      <section className="flex flex-col gap-6 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary-dark"
            to="/customer"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-primary-dark">
            New request
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tell us what needs to be done.
          </h1>

          <p className="mt-3 max-w-2xl text-base text-text-secondary">
            Describe the job and WorkX will help identify the right
            type of worker and relevant skills.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">
          <div className="grid size-10 place-items-center rounded-xl bg-primary-soft">
            <Sparkles className="size-5 text-primary-dark" />
          </div>

          <div>
            <p className="text-sm font-bold">
              Smart matching
            </p>

            <p className="text-xs text-text-secondary">
              Based on your job details
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Form */}
        <form
          className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
          onSubmit={submitRequest}
        >
          {/* Job description */}
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-primary-soft">
                <ClipboardList className="size-5 text-primary-dark" />
              </div>

              <div>
                <h2 className="text-lg font-extrabold">
                  Describe the job
                </h2>

                <p className="text-sm text-text-secondary">
                  Tell us what you need help with.
                </p>
              </div>
            </div>

            <textarea
              className="mt-5 min-h-40 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary-soft"
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="For example: My ceiling fan is making noise and has stopped rotating properly. I need someone to inspect and repair it."
              required
              value={description}
            />

            <div className="mt-3 flex flex-col gap-2 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">
              <span>
                Add as much detail as you can for better matches.
              </span>

              <span>
                {description.length} characters
              </span>
            </div>
          </div>

          {/* Voice hint */}
          <div className="mt-7 flex items-start gap-4 rounded-2xl border border-primary-light bg-primary-soft p-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface">
              <Mic className="size-5 text-primary-dark" />
            </div>

            <div>
              <p className="font-bold">
                Voice input ready for demo
              </p>

              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                In the complete WorkX experience, customers can describe
                their problem using voice and receive AI-assisted
                suggestions for the profession and skills.
              </p>
            </div>
          </div>

          {/* Details section */}
          <div className="mt-8 border-t border-border pt-8">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-primary-soft">
                <BriefcaseBusiness className="size-5 text-primary-dark" />
              </div>

              <div>
                <h2 className="text-lg font-extrabold">
                  Job details
                </h2>

                <p className="text-sm text-text-secondary">
                  Review and edit the suggested details.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {/* Profession */}
              <label className="block">
                <span className="text-sm font-bold">
                  Required profession
                </span>

                <select
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none transition focus:border-primary focus:ring-4 focus:ring-primary-soft"
                  onChange={(event) =>
                    setProfession(event.target.value)
                  }
                  value={profession}
                >
                  {professions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              {/* Location */}
              <label className="block">
                <span className="text-sm font-bold">
                  Job location
                </span>

                <div className="relative mt-2">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary-dark" />

                  <input
                    className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary-soft"
                    onChange={(event) =>
                      setLocation(event.target.value)
                    }
                    placeholder="Enter location"
                    required
                    value={location}
                  />
                </div>
              </label>
            </div>

            {/* Skills */}
            <label className="mt-5 block">
              <span className="text-sm font-bold">
                Required skills
              </span>

              <input
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary-soft"
                onChange={(event) =>
                  setSkills(event.target.value)
                }
                placeholder="Wiring, Fan Repair"
                value={skills}
              />

              <span className="mt-2 block text-xs text-text-secondary">
                Separate multiple skills with commas.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
            <Link
              className="inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-bold text-text-secondary transition hover:bg-surface-secondary"
              to="/customer"
            >
              Cancel
            </Link>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-text shadow-sm transition hover:bg-primary-dark hover:shadow-md"
              type="submit"
            >
              Find matching workers
              <ArrowRight className="size-5" />
            </button>
          </div>
        </form>

        {/* Right side */}
        <aside className="space-y-6">
          {/* AI analysis */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-primary-soft">
                <WandSparkles className="size-5 text-primary-dark" />
              </div>

              <div>
                <p className="font-extrabold">
                  Request analysis
                </p>

                <p className="text-sm text-text-secondary">
                  AI-assisted suggestions
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
                  Profession
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" />

                  <span className="font-bold">
                    {profession}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
                  Detected skills
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <span
                        className="rounded-lg bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary-dark"
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
                  Search area
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <MapPin className="size-4 text-primary-dark" />

                  <span className="font-semibold">
                    {location || "Your selected location"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-extrabold">
              What happens next?
            </h2>

            <div className="mt-5 space-y-5">
              <div className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-extrabold text-primary-dark">
                  1
                </span>

                <div>
                  <p className="font-bold">
                    Submit your request
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    We save the job details you provide.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-extrabold text-primary-dark">
                  2
                </span>

                <div>
                  <p className="font-bold">
                    Find relevant workers
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    WorkX matches skills, profession and location.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-extrabold text-primary-dark">
                  3
                </span>

                <div>
                  <p className="font-bold">
                    Choose who to contact
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    Review the matches and choose the right worker.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}