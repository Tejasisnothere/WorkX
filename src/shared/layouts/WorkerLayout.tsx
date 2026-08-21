import { NavLink, Outlet } from "react-router"
import { Logo } from "../components/Logo"

function WorkerLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo to="/worker" />

          <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
            <NavLink to="/worker">Dashboard</NavLink>
            <NavLink to="/worker/requests">Job requests</NavLink>
            <NavLink to="/worker/profile">Profile</NavLink>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default WorkerLayout