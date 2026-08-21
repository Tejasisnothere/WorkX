import { useEffect, useRef, useState } from "react"

import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"

import {
  useLocation,
  useNavigate,
} from "react-router"

import {
  readStorage,
  writeStorage,
} from "../../../shared/lib/storage"

import type {
  AccountRole,
  RegistrationDraft,
} from "../types"

const DEMO_OTP = "123456"

export function VerifyPhonePage() {
  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search)

  const phone =
    params.get("phone") ?? ""

  const requestedRole =
    (params.get("role") as AccountRole | null) ?? "customer"

  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [verified, setVerified] = useState(false)
  const [resendAvailable, setResendAvailable] =
    useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()

    const timer = window.setTimeout(() => {
      setResendAvailable(true)
    }, 30000)

    return () => window.clearTimeout(timer)
  }, [])

  function handleOtpChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6)

    setOtp(value)
    setError("")
  }

  function verifyOtp() {
    if (otp.length !== 6) {
      setError(
        "Please enter the 6-digit verification code.",
      )
      return
    }

    if (otp !== DEMO_OTP) {
      setError(
        "That code isn't correct. Use 123456 for the demo.",
      )
      return
    }

    const registration =
      readStorage<RegistrationDraft | null>(
        "workx:registration",
        null,
      )

    if (!registration) {
      setError(
        "No WorkX account was found. Please register first.",
      )
      return
    }

    const normalizedEnteredPhone =
      phone.replace(/\s/g, "")

    const normalizedRegisteredPhone =
      registration.phone.replace(/\s/g, "")

    if (
      normalizedEnteredPhone !==
      normalizedRegisteredPhone
    ) {
      setError(
        "This phone number is not registered with WorkX.",
      )
      return
    }

    if (registration.role !== requestedRole) {
      setError(
        requestedRole === "worker"
          ? "This number is registered as a customer. Choose 'Hire people' to continue."
          : "This number is registered as a worker. Choose 'Find work' to continue.",
      )
      return
    }

    setVerified(true)

    writeStorage("workx:session", {
      isAuthenticated: true,
      role: registration.role,
      phone: registration.phone,
      name: registration.name,
    })

    window.setTimeout(() => {
      navigate(
        registration.role === "worker"
          ? "/worker"
          : "/customer",
        {
          replace: true,
        },
      )
    }, 700)
  }

  function resendCode() {
    setResendAvailable(false)
    setError("")
    setOtp("")

    window.setTimeout(() => {
      setResendAvailable(true)
    }, 30000)
  }

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
            Verify your phone
          </h1>
        </div>

        {/* Main content */}
        <div className="mt-10">
          {verified ? (
            <div className="flex flex-col items-center text-center">
              <div className="grid size-16 place-items-center rounded-full bg-primary-light">
                <CheckCircle2 className="size-8 text-success" />
              </div>

              <h2 className="mt-6 text-3xl font-extrabold">
                You're verified
              </h2>

              <p className="mt-3 leading-relaxed text-text-secondary">
                Taking you to your WorkX dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="grid size-12 place-items-center rounded-xl bg-surface">
                <ShieldCheck className="size-6 text-primary-dark" />
              </div>

              <h2 className="mt-6 text-3xl font-extrabold">
                Enter your code
              </h2>

              <p className="mt-3 leading-relaxed text-text-secondary">
                We've sent a 6-digit verification code to
              </p>

              <p className="mt-1 font-bold text-text">
                {phone || "your phone"}
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                Signing in as{" "}
                <span className="font-bold text-text">
                  {requestedRole === "worker"
                    ? "Worker"
                    : "Customer"}
                </span>
              </p>
            </>
          )}
        </div>

        {!verified && (
          <>
            {/* Demo notice */}
            <div className="mt-8 rounded-xl border border-primary-light bg-surface p-4 text-sm text-text-secondary">
              <p className="font-bold text-primary-dark">
                Demo verification
              </p>

              <p className="mt-1">
                Use{" "}
                <span className="font-extrabold text-text">
                  123456
                </span>{" "}
                to continue.
              </p>
            </div>

            {/* OTP */}
            <label className="mt-7 text-xs font-bold uppercase tracking-wide text-text-muted">
              Verification code

              <input
                ref={inputRef}
                autoComplete="one-time-code"
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-4 text-center text-2xl font-extrabold tracking-[0.5em] text-text outline-none focus:border-primary-dark"
                inputMode="numeric"
                maxLength={6}
                onChange={handleOtpChange}
                placeholder="••••••"
                value={otp}
              />
            </label>

            {/* Error */}
            {error && (
              <p className="mt-3 text-sm font-semibold text-error">
                {error}
              </p>
            )}

            {/* Verify */}
            <button
              className="mt-7 w-full rounded-xl bg-primary px-5 py-4 font-extrabold text-text shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              disabled={otp.length !== 6}
              onClick={verifyOtp}
              type="button"
            >
              Verify & Continue
            </button>

            {/* Resend */}
            <div className="mt-5 text-center text-sm text-text-secondary">
              Didn't receive the code?{" "}

              <button
                className="font-bold text-primary-dark disabled:cursor-not-allowed disabled:text-text-muted"
                disabled={!resendAvailable}
                onClick={resendCode}
                type="button"
              >
                {resendAvailable
                  ? "Resend code"
                  : "Resend in 30s"}
              </button>
            </div>

            {/* Change number */}
            <button
              className="mx-auto mt-6 block text-sm font-bold text-text-secondary hover:text-primary-dark"
              onClick={() => navigate("/login")}
              type="button"
            >
              Change phone number
            </button>
          </>
        )}
      </section>
    </main>
  )
}