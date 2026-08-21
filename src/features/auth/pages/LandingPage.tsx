import { Link } from "react-router"

export function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12">
      <span className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">WorkX</span>
      <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 sm:text-7xl">
        Skilled local help, matched with clarity.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        Tell WorkX what you need by voice or text. We surface nearby workers and show exactly why each one fits.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link className="rounded-xl bg-primary px-5 py-3 font-semibold text-text shadow-sm hover:bg-primary-dark" to="/language">
          Get started
        </Link>
        <Link className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50" to="/login">
          I already have an account
        </Link>
      </div>
    </main>
  )
}
