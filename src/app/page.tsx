import Link from "next/link";

const stats = [
  { value: "28", label: "days logged" },
  { value: "112", label: "hours tracked" },
  { value: "7", label: "mood states" },
];

const features = [
  "Daily notes with tasks, tools, and reflections",
  "Fast search and date filtering for report prep",
  "Privacy-first student views with admin oversight later",
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-12">
        <header className="flex items-center justify-between gap-4 rounded-full border border-white/60 bg-white/70 px-4 py-3 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-teal-600 shadow-[0_0_24px_rgba(13,148,136,0.55)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-600">
              PKL Notes
            </span>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create account
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-50/80 px-4 py-2 text-sm font-medium text-teal-900 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Daily logbook for vocational practice
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Track every PKL shift with clarity.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Capture tasks, tools, skills, obstacles, and reflections in one
                calm workspace. The backend comes later; the UI is ready now.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Open dashboard
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white"
              >
                Browse login
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                >
                  <div className="text-3xl font-semibold tracking-tight text-slate-950">
                    {item.value}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-8 h-24 w-24 rounded-full bg-orange-400/20 blur-2xl" />
            <div className="absolute -right-4 bottom-10 h-28 w-28 rounded-full bg-teal-400/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[var(--surface)] p-6 shadow-[0_24px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    Today&apos;s note
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                    Workshop maintenance and documentation
                  </h2>
                </div>
                <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
                  Draft
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Summary
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Logged equipment checks, cleaned the workbench, and updated
                    the daily activity sheet with supervisor feedback.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Session
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    06.00 hours at the fabrication room with a focus on tools,
                    cleanliness, and report-ready detail.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200/80 bg-slate-950 p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
                  What is included
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
