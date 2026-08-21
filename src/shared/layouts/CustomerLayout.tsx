import { useState } from "react"

import {
  Bell,
  Bookmark,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  House,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Users,
  X,
} from "lucide-react"

import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router"

import { readStorage } from "../lib/storage"

import type { RegistrationDraft } from "../types/domain"

function CustomerLayout() {
  const navigate = useNavigate()

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const customer =
    readStorage<RegistrationDraft | null>(
      "workx:registration",
      null,
    )

  const customerName =
    customer?.name || "Vedaant Agarwal"

  const customerLocation =
    customer?.location || "Lucknow"

  function handleLogout() {
    navigate("/login")
  }

  function navLinkClass({
    isActive,
  }: {
    isActive: boolean
  }) {
    return `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-primary-soft text-primary-dark"
        : "text-text-secondary hover:bg-surface-secondary hover:text-text"
    }`
  }

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-300 lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Mobile logo */}
        <div className="flex h-[76px] items-center justify-between border-b border-border px-5">
          <Link
            className="flex items-center"
            onClick={() => setMobileMenuOpen(false)}
            to="/customer"
          >
            <img
              alt="WorkX"
              className="h-auto w-32 object-contain"
              src="/workx-logo-cropped.png"
            />
          </Link>

          <button
            aria-label="Close menu"
            className="rounded-lg p-2 transition hover:bg-surface-secondary"
            onClick={() => setMobileMenuOpen(false)}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Mobile navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <NavLink
            className={navLinkClass}
            end
            onClick={() => setMobileMenuOpen(false)}
            to="/customer"
          >
            <House className="size-5" />
            Dashboard
          </NavLink>

          <NavLink
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
            to="/customer/request"
          >
            <ClipboardList className="size-5" />
            My Requests
          </NavLink>

          <NavLink
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
            to="/customer/matches"
          >
            <Users className="size-5" />
            Matches
          </NavLink>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text"
            type="button"
          >
            <MessageCircle className="size-5" />
            Messages
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text"
            type="button"
          >
            <Bookmark className="size-5" />
            Saved Workers
          </button>
        </nav>

        {/* Mobile bottom */}
        <div className="space-y-1 border-t border-border p-4">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text"
            type="button"
          >
            <CircleHelp className="size-5" />
            Help & Support
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="size-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        {/* Logo — matches screenshot */}
        <div className="flex h-[76px] items-center border-b border-border px-5">
          <Link
            className="flex items-center"
            to="/customer"
          >
            <img
              alt="WorkX"
              className="h-auto w-32 object-contain"
              src="/workx-logo-cropped.png"
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <NavLink
            className={navLinkClass}
            end
            to="/customer"
          >
            <House className="size-5" />
            Dashboard
          </NavLink>

          <NavLink
            className={navLinkClass}
            to="/customer/request"
          >
            <ClipboardList className="size-5" />
            My Requests
          </NavLink>

          <NavLink
            className={navLinkClass}
            to="/customer/matches"
          >
            <Users className="size-5" />
            Matches
          </NavLink>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text"
            type="button"
          >
            <MessageCircle className="size-5" />
            Messages
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text"
            type="button"
          >
            <Bookmark className="size-5" />
            Saved Workers
          </button>
        </nav>

        {/* Desktop bottom navigation */}
        <div className="space-y-1 border-t border-border p-4">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text"
            type="button"
          >
            <CircleHelp className="size-5" />
            Help & Support
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="size-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <main className="min-h-screen lg:ml-64">
        {/* Top utility bar */}
        <header className="h-[76px] border-b border-border bg-surface">
          <div className="flex h-full items-center px-5 sm:px-8 lg:px-10">
            {/* Mobile menu */}
            <button
              aria-label="Open menu"
              className="rounded-xl border border-border p-2.5 transition hover:bg-surface-secondary lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              type="button"
            >
              <Menu className="size-5" />
            </button>

            {/* Right-side controls */}
            <div className="ml-auto flex items-center gap-3">
              {/* Location */}
              <button
                className="hidden items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-sm transition hover:bg-surface-secondary sm:flex"
                type="button"
              >
                <MapPin className="size-4 text-primary-dark" />

                <span className="max-w-32 truncate">
                  {customerLocation}
                </span>

                <ChevronDown className="size-4 text-text-muted" />
              </button>

              {/* Notification */}
              <button
                aria-label="Notifications"
                className="relative grid size-11 place-items-center rounded-xl border border-border bg-surface shadow-sm transition hover:bg-surface-secondary"
                type="button"
              >
                <Bell className="size-5 text-text-secondary" />

                <span className="absolute right-3 top-3 size-2 rounded-full bg-red-500 ring-2 ring-surface" />
              </button>

              {/* Profile */}
              <button
                className="flex items-center gap-3 rounded-xl border border-border bg-surface py-1.5 pl-2 pr-3 shadow-sm transition hover:bg-surface-secondary"
                type="button"
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-light text-sm font-extrabold text-primary-dark">
                  {customerName.charAt(0).toUpperCase()}
                </div>

                <span className="hidden max-w-28 truncate text-sm font-bold md:block">
                  {customerName}
                </span>

                <ChevronDown className="hidden size-4 text-text-muted md:block" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <Outlet />
      </main>
    </div>
  )
}

export default CustomerLayout