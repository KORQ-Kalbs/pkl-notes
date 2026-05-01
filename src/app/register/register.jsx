import Link from "next/link";

export default function RegisterView() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
      </div>

      <main className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <section className="order-2 space-y-6 lg:order-1">
          <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-50/90 px-4 py-2 text-sm font-medium text-orange-900 shadow-sm">
            Start here
          </span>
          <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Create your PKL Notes account.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Build your logbook foundation now so the dashboard, filters, and
            report flow can connect cleanly later.
          </p>

          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            {[
              "A focused workspace for daily documentation",
              "Prepared for student privacy and admin oversight",
              "Supports future search, filter, and export features",
              "Polished UI now, backend wiring next",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              >
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <p className="mt-4 text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="order-1 rounded-[2rem] border border-white/80 bg-[var(--surface)] p-6 shadow-[0_24px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl sm:p-8 lg:order-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Register
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Create an account
              </h2>
            </div>
            <Link
              href="/login"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Full name
              </span>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Email address
              </span>
              <input
                type="email"
                placeholder="student@school.id"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Confirm password
              </span>
              <input
                type="password"
                placeholder="Repeat your password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </label>

            <button
              type="button"
              className="mt-2 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create account
            </button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-slate-950 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
