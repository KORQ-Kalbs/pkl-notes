import Link from "next/link";

const navigation = [
  { label: "Overview", active: true },
  { label: "Users", active: false },
  { label: "Notes", active: false },
  { label: "Approvals", active: false },
  { label: "Settings", active: false },
];

const cards = [
  { label: "Pending", value: "12" },
  { label: "Approved", value: "48" },
  { label: "Flagged", value: "6" },
];

const rows = [
  { name: "Alya Pratama", note: "Workshop activity log", status: "Review" },
  { name: "Rafi Setiawan", note: "Reflection submission", status: "Approved" },
  { name: "Nadia Putri", note: "Tool usage notes", status: "Hold" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-[#070707] px-5 py-6">
          <div className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-[#0b0b0b] p-5">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.45em] text-zinc-500">
                Admin panel
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-white">
                PKL Notes
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Simple review workspace for admin tasks and note oversight.
              </p>
            </div>

            <nav className="mt-8 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    item.active
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.active ? (
                    <span className="h-2 w-2 rounded-full bg-black" />
                  ) : null}
                </button>
              ))}
            </nav>

            <div className="mt-auto space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
                Session
              </div>
              <div className="text-sm text-zinc-300">Admin review mode</div>
              <div className="text-xs text-zinc-500">Last sync: just now</div>
            </div>
          </div>
        </aside>

        <main className="px-5 py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-6">
            <header className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-[#0b0b0b] px-5 py-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                  Dashboard
                </div>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Overview and moderation queue
                </h2>
              </div>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                User dashboard
              </Link>
            </header>

            <section className="grid gap-4 sm:grid-cols-3">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[1.5rem] border border-white/10 bg-[#0b0b0b] p-5"
                >
                  <div className="text-sm text-zinc-500">{card.label}</div>
                  <div className="mt-3 text-4xl font-semibold tracking-tight text-white">
                    {card.value}
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0b0b0b] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                      Queue
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      Notes to review
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                    3 items
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {rows.map((row) => (
                    <article
                      key={row.name}
                      className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {row.name}
                          </div>
                          <div className="mt-1 text-sm text-zinc-400">
                            {row.note}
                          </div>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                          {row.status}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-[#0b0b0b] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                    Actions
                  </div>
                  <div className="mt-4 space-y-3">
                    <button
                      type="button"
                      className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black"
                    >
                      Review approvals
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-white"
                    >
                      Manage users
                    </button>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-[#0b0b0b] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                    Status
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    This is a plain black admin shell with sidebar navigation,
                    ready for backend wiring later.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
