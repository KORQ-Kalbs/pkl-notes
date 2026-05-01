import Link from "next/link";

const adminCards = [
  { label: "Pending reviews", value: "12" },
  { label: "Active students", value: "48" },
  { label: "New notes today", value: "19" },
];

const rows = [
  {
    name: "Alya Pratama",
    note: "Updated workshop activity log",
    status: "Needs review",
  },
  {
    name: "Rafi Setiawan",
    note: "Submitted reflection for Thursday shift",
    status: "Approved",
  },
  {
    name: "Nadia Putri",
    note: "Added tool usage and obstacle notes",
    status: "In progress",
  },
];

export default function AdminDashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-8 top-16 h-72 w-72 rounded-full bg-teal-400/18 blur-3xl" />
        <div className="absolute right-12 top-0 h-80 w-80 rounded-full bg-orange-300/18 blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-12">
        <div className="flex items-center justify-between rounded-full border border-white/70 bg-white/75 px-4 py-3 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.38em] text-slate-500">
              Admin tools
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Review notes, approvals, and student activity.
            </div>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Student view
          </Link>
        </div>

        <section className="grid gap-4 py-8 sm:grid-cols-3">
          {adminCards.map((card) => (
            <div
              key={card.label}
              className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl"
            >
              <div className="text-sm font-medium text-slate-500">
                {card.label}
              </div>
              <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                {card.value}
              </div>
            </div>
          ))}
        </section>

        <section className="grid flex-1 gap-6 pb-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200/80 bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Review queue
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Notes waiting for admin attention
            </h2>

            <div className="mt-6 space-y-4">
              {rows.map((row) => (
                <div
                  key={row.name}
                  className="rounded-3xl border border-slate-200/80 bg-white/85 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-slate-950">
                        {row.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {row.note}
                      </div>
                    </div>
                    <span className="rounded-full border border-teal-500/20 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                Expansion ready
              </div>
              <h3 className="mt-3 text-2xl font-semibold">
                Admin UI shell is in place
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                This section is set up for approvals, audit trails, and future
                bulk review actions once the backend is connected.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.1)] backdrop-blur-xl">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Next admin widgets
              </div>
              <ul className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-teal-500" />
                  Review status, export summaries, and note history.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-orange-400" />
                  Approval workflow and moderation controls.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-400" />
                  User management and role-based filters.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
