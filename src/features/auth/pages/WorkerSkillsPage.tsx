import { useState } from "react"
import { ArrowLeft, Check, Sparkles } from "lucide-react"
import { useNavigate } from "react-router"

import { readStorage, writeStorage } from "../../../shared/lib/storage"
import { PROFESSIONS, getProfessionSkills } from "../data/professions"

import type {
  ExperienceLevel,
  RegistrationDraft,
} from "../types"

const levels: ExperienceLevel[] = [
  "Beginner",
  "Intermediate",
  "Expert",
]

export function WorkerSkillsPage() {
  const navigate = useNavigate()

  const draft = readStorage<RegistrationDraft | null>(
    "workx:registration",
    null,
  )

  const [selectedProfessions, setSelectedProfessions] = useState<string[]>(
    draft?.professions ?? [],
  )

  const [selectedSkills, setSelectedSkills] = useState<
    Record<string, string[]>
  >(draft?.skills ?? {})

  const [experience, setExperience] = useState<ExperienceLevel>(
    draft?.experience ?? "Intermediate",
  )

  function toggleProfession(profession: string) {
    setSelectedProfessions((current) => {
      const isSelected = current.includes(profession)

      if (isSelected) {
        // Remove profession.
        const updatedProfessions = current.filter(
          (item) => item !== profession,
        )

        // Also remove its skills.
        setSelectedSkills((currentSkills) => {
          const updatedSkills = { ...currentSkills }

          delete updatedSkills[profession]

          return updatedSkills
        })

        return updatedProfessions
      }

      // Add profession.
      return [...current, profession]
    })
  }

  function toggleSkill(profession: string, skill: string) {
    setSelectedSkills((current) => {
      const professionSkills = current[profession] ?? []

      const isSelected = professionSkills.includes(skill)

      const updatedProfessionSkills = isSelected
        ? professionSkills.filter((item) => item !== skill)
        : [...professionSkills, skill]

      return {
        ...current,
        [profession]: updatedProfessionSkills,
      }
    })
  }

  function saveSkills() {
    if (!draft || selectedProfessions.length === 0) {
      return
    }

    const hasAtLeastOneSkill = selectedProfessions.some(
      (profession) => (selectedSkills[profession]?.length ?? 0) > 0,
    )

    if (!hasAtLeastOneSkill) {
      return
    }

    const updatedDraft: RegistrationDraft = {
      ...draft,
      professions: selectedProfessions,
      skills: selectedSkills,
      experience,
    }

    writeStorage("workx:registration", updatedDraft)

    navigate("/worker")
  }

  const hasAtLeastOneSkill = selectedProfessions.some(
    (profession) => (selectedSkills[profession]?.length ?? 0) > 0,
  )

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-text">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-sm lg:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT SIDE */}
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
            Worker setup · Step 2 of 2
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Show the community what you can do.
          </h1>

          <p className="mt-5 max-w-md leading-relaxed text-text-secondary">
            Tell WorkX what kinds of work you offer and the skills you can
            provide. You can choose more than one profession.
          </p>
        </aside>

        {/* RIGHT SIDE */}
        <div className="flex min-h-[540px] flex-col p-8 sm:p-12">
          <h2 className="text-2xl font-extrabold">
            Build your worker profile
          </h2>

          <p className="mt-2 text-text-secondary">
            Your selections help WorkX find relevant local opportunities.
          </p>

          {/* PROFESSIONS */}
          <p className="mt-7 text-xs font-bold uppercase tracking-wide text-text-muted">
            Your professions
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            Select all the types of work you offer.
          </p>

          <div className="mt-3 flex max-w-2xl flex-wrap gap-2">
            {PROFESSIONS.map((profession) => {
              const active = selectedProfessions.includes(profession.name)

              return (
                <button
                  className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                    active
                      ? "border-primary bg-primary text-text"
                      : "border-border bg-surface hover:border-primary"
                  }`}
                  key={profession.name}
                  onClick={() => toggleProfession(profession.name)}
                  type="button"
                >
                  {profession.name} {profession.icon}

                  {active && <Check className="size-3.5" />}
                </button>
              )
            })}
          </div>

          {/* SKILLS */}
          {selectedProfessions.length > 0 && (
            <>
              <p className="mt-7 text-xs font-bold uppercase tracking-wide text-text-muted">
                Your main skills
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                Choose the specific work you are comfortable doing.
              </p>

              <div className="mt-3 max-h-[280px] space-y-5 overflow-y-auto pr-2">
                {selectedProfessions.map((profession) => {
                  const skills = getProfessionSkills(profession)

                  return (
                    <div key={profession}>
                      <p className="mb-2 text-sm font-bold text-text">
                        {profession}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => {
                          const active =
                            selectedSkills[profession]?.includes(
                              skill.name,
                            ) ?? false

                          return (
                            <button
                              className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                                active
                                  ? "border-primary bg-primary text-text"
                                  : "border-border bg-surface hover:border-primary"
                              }`}
                              key={skill.name}
                              onClick={() =>
                                toggleSkill(profession, skill.name)
                              }
                              type="button"
                            >
                              {skill.name}

                              {active && (
                                <Check className="size-3.5" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* EXPERIENCE */}
          <p className="mt-7 text-xs font-bold uppercase tracking-wide text-text-muted">
            Your overall experience
          </p>

          <div className="mt-3 grid max-w-xl grid-cols-3 gap-2">
            {levels.map((level) => {
              const active = experience === level

              return (
                <button
                  className={`rounded-xl border px-2 py-3 text-sm font-bold transition ${
                    active
                      ? "border-primary-dark bg-primary-light"
                      : "border-border bg-surface hover:border-primary"
                  }`}
                  key={level}
                  onClick={() => setExperience(level)}
                  type="button"
                >
                  {level}
                </button>
              )
            })}
          </div>

          {/* AI EXPLANATION */}
          <div className="mt-7 flex max-w-2xl gap-3 rounded-xl border border-primary-light bg-primary-soft p-4 text-sm text-text-secondary">
            <Sparkles className="size-5 shrink-0 text-primary-dark" />

            <p>
              <span className="font-bold text-primary-dark">
                WorkX AI
              </span>{" "}
              understands the skills you offer and matches you with relevant
              community requirements.
            </p>
          </div>

          {/* CONTINUE */}
          <button
            className="mt-auto w-fit rounded-xl bg-primary px-8 py-4 font-extrabold text-text shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              selectedProfessions.length === 0 ||
              !hasAtLeastOneSkill
            }
            onClick={saveSkills}
            type="button"
          >
            Continue to dashboard
          </button>
        </div>
      </section>
    </main>
  )
}