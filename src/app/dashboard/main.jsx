import Link from "next/link";

const metrics = [
  { label: "Days logged", value: "28" },
  { label: "Total hours", value: "112.5" },
  { label: "Open drafts", value: "4" },
];

const notes = [
  {
    date: "Mon, 29 Apr",
    title: "Workshop cleanup and inventory check",
    summary:
      "Reviewed tool storage, organized the bench, and logged missing items for follow-up.",
  },
  {
    date: "Tue, 30 Apr",
    title: "Client file preparation",
    summary:
      "Prepared a daily summary, captured supervisor notes, and recorded next steps for review.",
  },
  {
    date: "Wed, 01 May",
    title: "System support and reporting",
    summary:
      "Documented the workflow, highlighted obstacles, and drafted the reflection section.",
  },
];

export default function DashboardMain() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-teal-400/18 blur-3xl" />
        <div className="absolute right-10 top-0 h-80 w-80 rounded-full bg-orange-300/18 blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-12">
        <div className="flex items-center justify-between rounded-full border border-white/70 bg-white/75 px-4 py-3 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.38em] text-slate-500">
              PKL Notes dashboard
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Daily logbook, search, and report-ready notes.
            </div>
          </div>
          <Link
            href="/login"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign out
          </Link>
        </div>

        <section className="grid gap-4 py-8 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl"
            >
              <div className="text-sm font-medium text-slate-500">
                {metric.label}
              </div>
              <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                {metric.value}
              </div>
            </div>
          ))}
        </section>

        <section className="grid flex-1 gap-6 pb-8 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200/80 bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    Quick note
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                    Capture today before the details fade
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-teal-500/20 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
                    Today
                  </span>
                  <span className="rounded-full border border-orange-500/20 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-900">
                    Draft mode
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Tasks completed
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Checked equipment, updated the sheet, and documented the
                    shift summary for the supervisor.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Reflection
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    The process is smoother when notes are captured in short
                    bursts right after each task.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  New note
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Filter date
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Export draft
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.1)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    Recent entries
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    Notes ready for review
                  </h3>
                </div>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                  3 items
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {notes.map((note) => (
                  <article
                    key={note.title}
                    className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      {note.date}
                    </div>
                    <h4 className="mt-3 text-lg font-semibold text-slate-950">
                      {note.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {note.summary}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                Mood tracker
              </div>
              <h3 className="mt-3 text-2xl font-semibold">
                Set the tone for the shift
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Use a quick mood marker to keep context around hard days, strong
                progress, or a calm session.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  "Focused",
                  "Productive",
                  "Tired",
                  "Curious",
                  "Confident",
                  "Blocked",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-center text-sm text-slate-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.1)] backdrop-blur-xl">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Next steps
              </div>
              <ul className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-teal-500" />
                  Add the activities section for the latest workshop session.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-orange-400" />
                  Connect search and filters after the backend endpoints are
                  ready.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-400" />
                  Prepare export and admin review workflows in the next pass.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
