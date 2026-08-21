import { Link } from "react-router"

export function WorkerDashboardPage() {
  return (
    <section><p className="text-sm font-semibold text-indigo-600">WORKER DASHBOARD</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Your work, in one place.</h1><p className="mt-3 text-slate-600">Complete your profile to start receiving local requests.</p><Link className="mt-7 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white" to="/worker/profile">Set up profile</Link></section>
  )
}
