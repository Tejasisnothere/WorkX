import { useParams } from "react-router"
import { mockWorkers } from "../data/mockWorkers"

export function WorkerDetailsPage() {
  const { id } = useParams()
  const worker = mockWorkers.find((item) => item.id === id)

  return (
    <section className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-indigo-600">WORKER PROFILE</p>
      <h1 className="mt-2 text-3xl font-bold">{worker?.name ?? "Worker not found"}</h1>
      {worker && <><p className="mt-2 text-slate-600">{worker.profession} · ★ {worker.rating} · {worker.completedJobs} completed jobs</p><p className="mt-5 leading-7 text-slate-700">{worker.bio}</p><div className="mt-5 flex flex-wrap gap-2">{worker.skills.map((skill) => <span className="rounded-full bg-slate-100 px-3 py-1 text-sm" key={skill}>{skill}</span>)}</div></>}
    </section>
  )
}
