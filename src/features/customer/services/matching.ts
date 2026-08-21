import type {
  JobRequest,
  Worker,
  WorkerMatch,
} from "../../../shared/types/domain"

const normalize = (value: string) =>
  value.trim().toLowerCase()

function getMatchedKeywords(
  request: JobRequest,
  worker: Worker,
): string[] {
  const requestText = [
    request.description,
    ...request.requiredSkills,
    ...request.keywords,
  ]
    .join(" ")
    .toLowerCase()

  return worker.keywords.filter((keyword) =>
    requestText.includes(keyword.toLowerCase()),
  )
}

/**
 * Deterministic hackathon matcher.
 *
 * This is intentionally kept behind a service boundary so it can later
 * be replaced with the backend AI recommendation engine.
 */
export function matchWorkers(
  request: JobRequest,
  workers: Worker[],
): WorkerMatch[] {
  const requestedSkills = request.requiredSkills.map(normalize)

  return workers
    .filter(
      (worker) =>
        normalize(worker.profession) ===
        normalize(request.profession),
    )
    .map((worker) => {
      const matchedSkills = worker.skills.filter((skill) =>
        requestedSkills.includes(normalize(skill)),
      )

      const missingSkills = request.requiredSkills.filter(
        (skill) =>
          !worker.skills.some(
            (workerSkill) =>
              normalize(workerSkill) === normalize(skill),
          ),
      )

      const matchedKeywords = getMatchedKeywords(
        request,
        worker,
      )

      const availabilityScore =
        worker.availability === "available" ? 20 : 0

      const distanceScore = Math.max(
        0,
        15 - Math.round(worker.distanceKm * 3),
      )

      const skillScore = matchedSkills.length * 10

      const keywordScore = Math.min(
        15,
        matchedKeywords.length * 3,
      )

      const score = Math.min(
        100,
        50 +
          skillScore +
          keywordScore +
          availabilityScore +
          distanceScore,
      )

      const reasons = [
        "Profession match",

        ...(matchedSkills.length
          ? [
              `Matches ${matchedSkills.length} requested skill${
                matchedSkills.length === 1 ? "" : "s"
              }`,
            ]
          : []),

        ...(matchedKeywords.length
          ? [
              `Matches ${matchedKeywords.length} relevant keyword${
                matchedKeywords.length === 1 ? "" : "s"
              }`,
            ]
          : []),

        ...(worker.availability === "available"
          ? ["Available now"]
          : []),

        ...(worker.distanceKm <= 3
          ? [`Only ${worker.distanceKm} km away`]
          : []),
      ]

      return {
        ...worker,
        score,
        matchedSkills,
        matchedKeywords,
        missingSkills,
        reasons,
      }
    })
    .sort((a, b) => b.score - a.score)
}