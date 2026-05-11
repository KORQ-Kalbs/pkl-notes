"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const variantConfig = {
  user: {
    homeHref: "/dashboard",
    label: "PKL Notes",
  },
  admin: {
    homeHref: "/admin-dashboard",
    label: "PKL Notes",
  },
};

export default function DashboardShell({ variant = "user", children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const config = useMemo(
    () => variantConfig[variant] || variantConfig.user,
    [variant],
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar
        variant={variant}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border-color bg-bg-primary/95 px-4 py-3 backdrop-blur md:hidden">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border-color bg-white/5 text-text-primary transition-colors hover:bg-white/10"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-controls="sidebar-drawer"
          aria-expanded={mobileOpen}
        >
          <Menu size={20} />
        </button>
        <Link
          href={config.homeHref}
          className="font-display text-base tracking-wide"
        >
          {config.label}
        </Link>
        <span className="h-11 w-11" aria-hidden="true" />
      </header>

      <main className="min-h-screen pb-16 md:ml-20 lg:ml-[var(--sidebar-width)]">
        {children}
      </main>
    </div>
  );
}
