import { useState } from "react"

import {
  ArrowLeft,
  Smartphone,
} from "lucide-react"

import {
  Link,
  useNavigate,
} from "react-router"

import type { AccountRole } from "../types"

export function LoginPage() {
  const navigate = useNavigate()

  const [role, setRole] = useState<AccountRole>("worker")
  const [phone, setPhone] = useState("")

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-text">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col rounded-[2rem] bg-primary-soft p-6 shadow-sm sm:border sm:border-border">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Back"
            className="rounded-lg p-1 hover:bg-primary-light"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ArrowLeft className="size-5" />
          </button>

          <h1 className="font-extrabold">
            Welcome back
          </h1>
        </div>

        {/* Introduction */}
        <div className="mt-10">
          <h2 className="text-3xl font-extrabold">
            Sign in with your phone
          </h2>

          <p className="mt-3 leading-relaxed text-text-secondary">
            Choose how you use WorkX and enter your registered
            phone number.
          </p>
        </div>

        {/* Role selection */}
        <p className="mt-8 text-xs font-bold uppercase tracking-wide text-text-muted">
          I want to...
        </p>

        <div className="mt-2 grid grid-cols-2 rounded-xl bg-surface-secondary p-1">
          <button
            className={`rounded-lg py-3 text-sm font-bold transition ${
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
            className={`rounded-lg py-3 text-sm font-bold transition ${
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

        {/* Phone information */}
        <div className="mt-8 rounded-xl bg-surface p-4 text-sm text-text-secondary">
          <Smartphone className="mb-2 size-5 text-primary-dark" />

          <p>
            Your phone number is your WorkX digital ID.
          </p>
        </div>

        {/* Phone input */}
        <label className="mt-6 text-xs font-bold uppercase tracking-wide text-text-muted">
          Phone number

          <input
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text outline-none focus:border-primary-dark"
            inputMode="tel"
            onChange={(event) =>
              setPhone(event.target.value)
            }
            placeholder="+91 98765 43210"
            value={phone}
          />
        </label>

        {/* Login button */}
        <button
          className="mt-auto w-full rounded-xl bg-primary px-5 py-4 font-extrabold text-text shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!phone.trim()}
          onClick={() => {
            const params = new URLSearchParams({
              phone,
              role,
            })

            navigate(`/login/verify?${params.toString()}`)
          }}
          type="button"
        >
          Send verification code
        </button>

        {/* Register link */}
        <p className="mt-5 text-center text-sm text-text-secondary">
          Don't have an account?{" "}

          <Link
            className="font-bold text-primary-dark hover:underline"
            to="/register"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}