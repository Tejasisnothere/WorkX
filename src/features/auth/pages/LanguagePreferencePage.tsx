import { useState } from "react"
import { Check } from "lucide-react"
import { useNavigate } from "react-router"

import { LANGUAGES } from "../../onboarding/data/catalog"
import { writeStorage } from "../../../shared/lib/storage"

export function LanguagePreferencePage() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState("en")

  function continueToRegistration() {
    writeStorage("workx:language", language)
    navigate("/register")
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-text"><section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-sm lg:grid-cols-[1.1fr_0.9fr]"><div className="bg-primary-soft p-8 sm:p-12"><p className="text-3xl font-extrabold">Work<span className="text-primary-dark">X</span></p><p className="mt-24 text-sm font-bold uppercase tracking-[0.2em] text-primary-dark">Your WorkX experience</p><h1 className="mt-4 max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">Choose a language that feels natural.</h1><p className="mt-5 max-w-lg text-lg leading-relaxed text-text-secondary">WorkX is designed for local work and local voices. Your choice is saved on this device and can be updated any time.</p></div><div className="flex min-h-[480px] flex-col p-8 sm:p-12"><h2 className="text-2xl font-extrabold">Language preference</h2><p className="mt-2 text-text-secondary">Select one to continue.</p><div className="mt-8 grid grid-cols-2 gap-3">{LANGUAGES.map((item) => <button className={`relative rounded-xl border px-5 py-5 text-left font-bold transition ${language === item.code ? "border-primary-dark bg-primary-light" : "border-border bg-surface hover:border-primary"}`} key={item.code} onClick={() => setLanguage(item.code)} type="button">{item.native}{language === item.code && <Check className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-success" />}</button>)}</div><button className="mt-auto w-full rounded-xl bg-primary px-5 py-4 font-extrabold text-text shadow-sm transition hover:bg-primary-dark" onClick={continueToRegistration} type="button">Continue to Registration</button></div></section></main>
  )
}
