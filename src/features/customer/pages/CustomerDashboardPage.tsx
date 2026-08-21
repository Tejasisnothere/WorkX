import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react"

import { Link } from "react-router"

import { readStorage } from "../../../shared/lib/storage"

import { mockWorkers } from "../data/mockWorkers"

interface CustomerSession {
  isAuthenticated: boolean
  role: "customer" | "worker"
  phone: string
  name: string
}

interface StoredRequest {
  id: string
  customerId: string
  description: string
  profession: string
  requiredSkills: string[]
  keywords: string[]
  location: string
  createdAt: string
  status: "open" | "matched" | "in-progress" | "completed"
}

export function CustomerDashboardPage() {
  const session = readStorage<CustomerSession | null>(
    "workx:session",
    null,
  )

  const requests = readStorage<StoredRequest[]>(
    "workx:requests",
    [],
  )

  const savedWorkers = readStorage<string[]>(
    "workx:saved-workers",
    [],
  )

  const customerName =
    session?.name?.trim() || "there"

  const customerLocation = readStorage<string>(
    "workx:customer-location",
    "Lucknow",
  )

  const activeRequests = requests.filter(
    (request) =>
      request.status === "open" ||
      request.status === "matched" ||
      request.status === "in-progress",
  )

  const nearbyWorkers = [...mockWorkers]
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3)

  const savedWorkerCount = savedWorkers.length

  function formatRequestTitle(request: StoredRequest) {
    if (request.description.length <= 42) {
      return request.description
    }

    return `${request.description.slice(0, 42)}...`
  }

  function formatDate(date: string) {
    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently"
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    })
  }

  function scrollToSavedWorkers() {
    document
      .getElementById("saved-workers")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      {/* Welcome */}
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary-dark">
            Customer dashboard
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Good morning, {customerName}.
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-primary-dark" />
              {customerLocation}
            </span>

            <span className="hidden size-1 rounded-full bg-text-muted sm:block" />

            <span>
              Find trusted local help for the job in front of you.
            </span>
          </div>
        </div>

        <Link
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-bold text-text shadow-sm transition hover:bg-primary-dark"
          to="/customer/request"
        >
          <ClipboardList className="size-5" />
          Create a request
        </Link>
      </section>

      {/* Summary Cards */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          to="/customer/request"
        >
          <div className="flex items-center justify-between">
            <div className="grid size-11 place-items-center rounded-xl bg-primary-soft">
              <ClipboardList className="size-5 text-primary-dark" />
            </div>

            <ArrowRight className="size-5 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary-dark" />
          </div>

          <p className="mt-5 text-sm font-semibold text-text-secondary">
            Active requests
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-extrabold">
              {activeRequests.length}
            </span>

            <span className="mb-1 text-xs font-semibold text-primary-dark">
              {activeRequests.length === 1
                ? "request active"
                : "requests active"}
            </span>
          </div>
        </Link>

        <Link
          className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          to="/customer/matches"
        >
          <div className="flex items-center justify-between">
            <div className="grid size-11 place-items-center rounded-xl bg-primary-soft">
              <Users className="size-5 text-primary-dark" />
            </div>

            <ArrowRight className="size-5 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary-dark" />
          </div>

          <p className="mt-5 text-sm font-semibold text-text-secondary">
            Nearby matches
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-extrabold">
              {mockWorkers.length}
            </span>

            <span className="mb-1 text-xs font-semibold text-success">
              workers found
            </span>
          </div>
        </Link>

        <button
          className="group rounded-2xl border border-border bg-surface p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          onClick={scrollToSavedWorkers}
          type="button"
        >
          <div className="flex items-center justify-between">
            <div className="grid size-11 place-items-center rounded-xl bg-primary-soft">
              <Bookmark className="size-5 text-primary-dark" />
            </div>

            <ArrowRight className="size-5 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary-dark" />
          </div>

          <p className="mt-5 text-sm font-semibold text-text-secondary">
            Saved workers
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-extrabold">
              {savedWorkerCount}
            </span>

            <span className="mb-1 text-xs font-semibold text-text-secondary">
              saved for later
            </span>
          </div>
        </button>
      </section>

      {/* Main Content */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Requests */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold">
                Recent requests
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Keep track of the work you've posted.
              </p>
            </div>

            {requests.length > 0 && (
              <Link
                className="shrink-0 text-sm font-bold text-primary-dark hover:underline"
                to="/customer/request"
              >
                View all
              </Link>
            )}
          </div>

          {requests.length > 0 ? (
            <div className="mt-6 divide-y divide-border">
              {requests.slice(0, 3).map((request) => (
                <div
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  key={request.id}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft">
                      <Search className="size-5 text-primary-dark" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold">
                        {formatRequestTitle(request)}
                      </p>

                      <p className="mt-1 text-sm text-text-secondary">
                        {request.profession} ·{" "}
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      request.status === "completed"
                        ? "bg-green-50 text-success"
                        : request.status === "in-progress"
                          ? "bg-primary-soft text-primary-dark"
                          : "bg-surface-secondary text-text-secondary"
                    }`}
                  >
                    {request.status === "in-progress"
                      ? "In progress"
                      : request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl bg-surface-secondary p-6 text-center">
              <div className="mx-auto grid size-11 place-items-center rounded-full bg-primary-soft">
                <ClipboardList className="size-5 text-primary-dark" />
              </div>

              <p className="mt-4 font-bold">
                No requests yet
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                Create your first request and find the right local worker.
              </p>

              <Link
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-dark hover:underline"
                to="/customer/request"
              >
                Create a request
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Workers */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold">
                Recommended workers
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Skilled people available nearby.
              </p>
            </div>

            <Link
              className="shrink-0 text-sm font-bold text-primary-dark hover:underline"
              to="/customer/matches"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 divide-y divide-border">
            {nearbyWorkers.map((worker) => (
              <div
                className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                key={worker.id}
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-light font-extrabold">
                  {worker.name.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">
                    {worker.name}
                  </p>

                  <p className="mt-0.5 text-sm text-text-secondary">
                    {worker.profession}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3 fill-current text-primary-dark" />
                      {worker.rating}
                    </span>

                    <span>
                      {worker.distanceKm} km away
                    </span>

                    <span
                      className={
                        worker.availability === "available"
                          ? "font-semibold text-success"
                          : "text-text-muted"
                      }
                    >
                      {worker.availability === "available"
                        ? "Available"
                        : "Busy"}
                    </span>
                  </div>
                </div>

                <Link
                  className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-bold transition hover:border-primary hover:bg-primary-soft"
                  to={`/customer/worker/${worker.id}`}
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Saved Workers */}
      <section
        className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm"
        id="saved-workers"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold">
              Saved workers
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Professionals you've saved for future jobs.
            </p>
          </div>

          <Bookmark className="size-5 text-primary-dark" />
        </div>

        {savedWorkers.length === 0 ? (
          <div className="mt-5 flex flex-col gap-4 rounded-xl bg-surface-secondary p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold">
                No saved workers yet
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                Save workers you trust to quickly find them again.
              </p>
            </div>

            <Link
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary-dark hover:underline"
              to="/customer/matches"
            >
              Explore workers
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-3">
            {savedWorkers.slice(0, 5).map((workerId) => {
              const worker = mockWorkers.find(
                (item) => item.id === workerId,
              )

              if (!worker) {
                return null
              }

              return (
                <Link
                  className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition hover:border-primary hover:bg-primary-soft"
                  key={worker.id}
                  to={`/customer/worker/${worker.id}`}
                >
                  <div className="grid size-9 place-items-center rounded-full bg-primary-light text-sm font-bold">
                    {worker.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      {worker.name}
                    </p>

                    <p className="text-xs text-text-secondary">
                      {worker.profession}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Trust Strip */}
      <section className="mt-6 grid gap-3 pb-6 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft">
            <ShieldCheck className="size-5 text-primary-dark" />
          </div>

          <div>
            <p className="text-sm font-bold">
              Verified & trusted
            </p>

            <p className="mt-0.5 text-xs text-text-secondary">
              Built around relevant worker skills.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft">
            <MapPin className="size-5 text-primary-dark" />
          </div>

          <div>
            <p className="text-sm font-bold">
              Local first
            </p>

            <p className="mt-0.5 text-xs text-text-secondary">
              Find skilled workers close to you.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft">
            <CheckCircle2 className="size-5 text-primary-dark" />
          </div>

          <div>
            <p className="text-sm font-bold">
              Clear matching
            </p>

            <p className="mt-0.5 text-xs text-text-secondary">
              See why a worker matches your request.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}