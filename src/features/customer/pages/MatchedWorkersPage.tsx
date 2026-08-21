import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  MapPin,
  Search,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react"

import { Link } from "react-router"

import { mockWorkers } from "../data/mockWorkers"

import { matchWorkers } from "../services/matching"

import { readStorage } from "../../../shared/lib/storage"

import type { JobRequest } from "../../../shared/types/domain"

const demoRequest: JobRequest = {
  id: "demo-request",
  customerId: "demo-customer",
  profession: "Electrical",
  description: "Need help fixing a ceiling fan.",
  requiredSkills: ["Fan Repair"],
  keywords: [
    "fan",
    "ceiling fan",
    "fan repair",
  ],
  location: "Indiranagar",
  createdAt: new Date().toISOString(),
  status: "open",
}

export function MatchedWorkersPage() {
  const request = readStorage<JobRequest>(
    "workx:last-request",
    demoRequest,
  )

  const matches = matchWorkers(request, mockWorkers)

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Page heading */}
      <section className="border-b border-border pb-7">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary-dark"
          to="/customer/request"
        >
          <ArrowLeft className="size-4" />
          Back to request
        </Link>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary-dark">
                Your matches
              </p>

              <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary-dark">
                {matches.length} found
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Workers for your{" "}
              {request.profession.toLowerCase()} job.
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-primary-dark" />
                {request.location}
              </span>

              <span className="hidden size-1 rounded-full bg-text-muted sm:block" />

              <span>
                Ranked based on skills, availability and distance.
              </span>
            </div>
          </div>

          <Link
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 font-bold text-text shadow-sm transition hover:bg-surface-secondary"
            to="/customer/request"
          >
            <Search className="size-4" />
            Edit request
          </Link>
        </div>
      </section>

      {/* Match summary */}
      <section className="mt-7 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="grid size-11 place-items-center rounded-xl bg-primary-soft">
            <Users className="size-5 text-primary-dark" />
          </div>

          <p className="mt-4 text-sm font-semibold text-text-secondary">
            Relevant workers
          </p>

          <p className="mt-1 text-3xl font-extrabold">
            {matches.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="grid size-11 place-items-center rounded-xl bg-primary-soft">
            <BadgeCheck className="size-5 text-primary-dark" />
          </div>

          <p className="mt-4 text-sm font-semibold text-text-secondary">
            Looking for
          </p>

          <p className="mt-1 text-lg font-extrabold">
            {request.profession}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="grid size-11 place-items-center rounded-xl bg-primary-soft">
            <MapPin className="size-5 text-primary-dark" />
          </div>

          <p className="mt-4 text-sm font-semibold text-text-secondary">
            Search location
          </p>

          <p className="mt-1 text-lg font-extrabold">
            {request.location}
          </p>
        </div>
      </section>

      {/* Results */}
      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">
              Recommended workers
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              The best matches for the details in your request.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Sparkles className="size-4 text-primary-dark" />
            Sorted by best match
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {matches.map((worker, index) => (
              <article
                className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-primary-light hover:shadow-md"
                key={worker.id}
              >
                <div className="p-6">
                  {/* Worker heading */}
                  <div className="flex items-start gap-4">
                    <div className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-primary-light text-lg font-extrabold text-text">
                      {worker.name.charAt(0).toUpperCase()}

                      {index === 0 && (
                        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-text">
                          <Star className="size-3 fill-current" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="truncate text-xl font-extrabold">
                            {worker.name}
                          </h3>

                          <p className="mt-1 text-sm text-text-secondary">
                            {worker.profession}
                          </p>
                        </div>

                        <div className="rounded-xl bg-primary-soft px-3 py-2 text-right">
                          <p className="text-xs font-semibold text-text-secondary">
                            Match
                          </p>

                          <p className="text-lg font-extrabold text-primary-dark">
                            {worker.score}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                        <span className="inline-flex items-center gap-1">
                          <Star className="size-3 fill-current text-primary-dark" />
                          {worker.rating}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3 text-primary-dark" />
                          {worker.distanceKm} km away
                        </span>

                        <span
                          className={
                            worker.availability === "available"
                              ? "font-bold text-success"
                              : "font-semibold text-text-muted"
                          }
                        >
                          {worker.availability === "available"
                            ? "Available now"
                            : "Currently busy"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Why recommended */}
                  <div className="mt-6 rounded-xl bg-background p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-primary-dark" />

                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-secondary">
                        Why this worker matches
                      </p>
                    </div>

                    <div className="mt-3 space-y-2">
                      {worker.reasons.slice(0, 3).map((reason) => (
                        <div
                          className="flex items-start gap-2 text-sm text-text-secondary"
                          key={reason}
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-success" />

                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
                        Matching skills
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {worker.matchedSkills.length > 0 ? (
                          worker.matchedSkills.map((skill) => (
                            <span
                              className="rounded-lg bg-primary-soft px-2.5 py-1.5 text-xs font-bold text-primary-dark"
                              key={skill}
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-text-secondary">
                            Profession match
                          </span>
                        )}
                      </div>
                    </div>

                    {worker.missingSkills.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
                          Not listed
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {worker.missingSkills.map((skill) => (
                            <span
                              className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-text-secondary"
                              key={skill}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border bg-surface-secondary/40 px-6 py-4">
                  <span className="text-sm text-text-secondary">
                    Match #{index + 1}
                  </span>

                  <Link
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-text transition hover:bg-primary-dark"
                    to={`/customer/worker/${worker.id}`}
                  >
                    View profile
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-10 text-center shadow-sm">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft">
              <Search className="size-6 text-primary-dark" />
            </div>

            <h2 className="mt-5 text-xl font-extrabold">
              No close matches yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
              Try changing your request details or profession to explore
              more workers.
            </p>

            <Link
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-text transition hover:bg-primary-dark"
              to="/customer/request"
            >
              Edit request
              <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Bottom info */}
      <section className="mt-8 rounded-2xl border border-primary-light bg-primary-soft p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary-dark">
              Explainable matching
            </p>

            <h2 className="mt-2 text-xl font-extrabold">
              Know why a worker was recommended.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
              WorkX considers profession, skill overlap, availability and
              distance to help you understand every recommendation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-primary-dark">
            <Sparkles className="size-5" />
            Clear and transparent matching
          </div>
        </div>
      </section>
    </div>
  )
}