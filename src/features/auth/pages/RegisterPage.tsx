import { useState } from "react"

import { ArrowLeft, Mic, Smartphone } from "lucide-react"

import { Link, useNavigate } from "react-router"

import { readStorage, writeStorage } from "../../../shared/lib/storage"

import type { AccountRole, RegistrationDraft } from "../types"

export function RegisterPage() {
  const navigate = useNavigate()

  const [role, setRole] = useState<AccountRole>("worker")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")

  function register(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const language = readStorage("workx:language", "en")

    const draft: RegistrationDraft = {
      language,
      role,
      name,
      phone,
      location,
    }

    writeStorage("workx:registration", draft)

    navigate(role === "worker" ? "/register/skills" : "/customer")
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-text">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-sm lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left panel */}
        <aside className="bg-primary-soft p-8 sm:p-12">
          <button
            aria-label="Back"
            className="rounded-lg p-1 hover:bg-primary-light"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ArrowLeft className="size-5" />
          </button>

          <p className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-primary-dark">
            Create account
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Work, made local.
          </h1>

          <p className="mt-5 max-w-md leading-relaxed text-text-secondary">
            A phone number is all you need to start finding skilled help
            nearby—or offering your own skills to the community.
          </p>

          <div className="mt-10 flex gap-3 rounded-xl bg-surface p-4 text-sm leading-relaxed text-text-secondary">
            <Smartphone className="size-5 shrink-0 text-primary-dark" />

            <span>
              No email needed. Your phone number is your secure digital ID,
              offline and online.
            </span>
          </div>
        </aside>

        {/* Registration form */}
        <form
          className="p-8 sm:p-12"
          onSubmit={register}
        >
          <h2 className="text-2xl font-extrabold">
            Tell us about yourself
          </h2>

          <p className="mt-2 text-text-secondary">
            Choose what you want to do with WorkX.
          </p>

          {/* Role selection */}
          <p className="mt-8 text-xs font-bold uppercase tracking-wide text-text-muted">
            I want to...
          </p>

          <div className="mt-2 grid max-w-md grid-cols-2 rounded-xl bg-surface-secondary p-1">
            <button
              className={`rounded-lg py-3 text-sm font-bold ${
                role === "worker"
                  ? "bg-surface shadow-sm"
                  : "text-text-secondary"
              }`}
              onClick={() => setRole("worker")}
              type="button"
            >
              Find work
            </button>

            <button
              className={`rounded-lg py-3 text-sm font-bold ${
                role === "customer"
                  ? "bg-surface shadow-sm"
                  : "text-text-secondary"
              }`}
              onClick={() => setRole("customer")}
              type="button"
            >
              Hire people
            </button>
          </div>

          {/* Personal information */}
          <div className="mt-7 grid max-w-2xl gap-5 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase tracking-wide text-text-muted">
              Your Full Name

              <input
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text outline-none focus:border-primary-dark"
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                value={name}
              />
            </label>

            <label className="text-xs font-bold uppercase tracking-wide text-text-muted">
              Phone Number

              <input
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text outline-none focus:border-primary-dark"
                inputMode="tel"
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 98765 43210"
                required
                value={phone}
              />
            </label>

            <label className="text-xs font-bold uppercase tracking-wide text-text-muted sm:col-span-2">
              Village / Town / City

              <div className="relative mt-2">
                <input
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-11 text-sm font-semibold text-text outline-none focus:border-primary-dark"
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Where are you located?"
                  required
                  value={location}
                />

                <Mic className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary-dark" />
              </div>
            </label>
          </div>

          {/* Register button */}
          <button
            className="mt-10 rounded-xl bg-primary px-8 py-4 font-extrabold text-text shadow-sm transition hover:bg-primary-dark"
            type="submit"
          >
            Register and Continue
          </button>

          {/* Login link */}
          <p className="mt-5 text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              className="font-bold text-primary-dark hover:underline"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}