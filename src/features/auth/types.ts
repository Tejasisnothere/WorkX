export type AccountRole = "worker" | "customer"

export type ExperienceLevel =
  | "Beginner"
  | "Intermediate"
  | "Expert"

export interface RegistrationDraft {
  language: string
  role: AccountRole
  name: string
  phone: string
  location: string

  professions?: string[]

  skills?: Record<string, string[]>

  experience?: ExperienceLevel
}