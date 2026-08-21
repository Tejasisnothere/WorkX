export type UserRole = "customer" | "worker"

export type Availability = "available" | "busy" | "offline"

export type ExperienceLevel = "Beginner" | "Intermediate" | "Expert"

export interface Worker {
  id: string
  name: string
  phone: string
  language: string
  profession: string
  skills: string[]
  keywords: string[]
  experience: ExperienceLevel
  location: string
  distanceKm: number
  rating: number
  completedJobs: number
  availability: Availability
  bio: string
}

export interface JobRequest {
  id: string
  customerId: string
  profession: string
  description: string
  requiredSkills: string[]
  keywords: string[]
  location: string
  createdAt: string
  status: "open" | "accepted" | "completed"
}

export interface WorkerMatch extends Worker {
  score: number
  matchedSkills: string[]
  matchedKeywords: string[]
  missingSkills: string[]
  reasons: string[]
}