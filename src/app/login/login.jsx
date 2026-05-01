import Link from "next/link";

export default function LoginView() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-16 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-orange-300/18 blur-3xl" />
      </div>

      <main className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <section className="space-y-6">
          <span className="inline-flex rounded-full border border-teal-500/15 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
            Welcome back
          </span>
          <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Sign in to continue your PKL log.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Keep your daily notes, reflections, and session history in one clean
            workspace. The form is ready for the next backend step.
          </p>

          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            {[
              "Private note storage for each student account",
              "Quick access to dashboard, drafts, and recent sessions",
              "Built for reports, check-ins, and supervisor review",
              "Simple flow that keeps the UI calm and fast",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/70 bg-white/82 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <div className="h-2 w-2 rounded-full bg-teal-500/80" />
                <p className="mt-4 text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-white/78 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Sign in
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Return to your dashboard
              </h2>
            </div>
            <Link
              href="/register"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Create account
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Email address
              </span>
              <input
                type="email"
                placeholder="student@school.id"
                className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              />
            </label>

            <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
              <span>
                Use this screen as the UI foundation for auth wiring later.
              </span>
            </div>

            <button
              type="button"
              className="mt-2 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-slate-600">
              New here?{" "}
              <Link
                href="/register"
                className="font-semibold text-slate-950 underline-offset-4 hover:underline"
              >
                Create your account
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
