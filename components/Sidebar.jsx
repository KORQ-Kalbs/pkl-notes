"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutGrid,
  NotebookPen,
  Settings,
  Users,
} from "lucide-react";
import SettingsPanel from "./SettingsPanel";

const baseLinkClass =
  "inline-flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary border border-transparent transition-all duration-200 hover:text-text-primary hover:border-border-color hover:bg-white/5";
const activeLinkClass =
  "inline-flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary border border-transparent transition-all duration-200 hover:text-text-primary hover:border-border-color hover:bg-white/5 bg-white/5 border-border-color text-text-primary";

const userNav = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "New note",
    href: "/dashboard/notes",
    icon: NotebookPen,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: ClipboardList,
  },
];

const adminNav = [
  {
    label: "Overview",
    href: "/admin-dashboard",
    icon: LayoutGrid,
  },
  {
    label: "History",
    href: "/admin-dashboard/history",
    icon: ClipboardList,
  },
  {
    label: "Users management",
    href: "/admin-dashboard/users",
    icon: Users,
  },
];

export default function Sidebar({ variant = "user" }) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems = useMemo(
    () => (variant === "admin" ? adminNav : userNav),
    [variant],
  );

  const panelCopy =
    variant === "admin"
      ? {
          title: "PKL Notes",
          kicker: "Admin panel",
          description:
            "Simple review workspace for admin tasks and note oversight.",
          sessionTitle: "Admin review mode",
          sessionMeta: "Last sync: just now",
        }
      : {
          title: "PKL Notes",
          kicker: "User workspace",
          description: "",
          sessionTitle: "Daily entry mode",
          sessionMeta: "Sync: just now",
        };

  useEffect(() => {
    if (!settingsOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [settingsOpen]);

  const isActive = (href) =>
    pathname === href || (pathname?.startsWith(href) && href !== "/");

  return (
    <>
      <aside className="flex flex-col gap-10 p-10 border-r bg-bg-secondary border-border-color">
        <div className="grid gap-2">
          <p className="text-kicker">{panelCopy.kicker}</p>
          <h2 className="font-display text-[1.6rem]">{panelCopy.title}</h2>
          {panelCopy.description ? (
            <p className="text-sm text-text-secondary">
              {panelCopy.description}
            </p>
          ) : null}
        </div>
        <nav className="grid gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive(item.href) ? activeLinkClass : baseLinkClass
                }
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            className={baseLinkClass}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings size={18} />
            Settings
          </button>
        </nav>
        <div className="grid gap-3 p-5 mt-auto border rounded-lg border-border-color bg-white/5">
          <p className="text-kicker">Session</p>
          <p className="font-semibold">{panelCopy.sessionTitle}</p>
          <p className="text-sm text-text-secondary">{panelCopy.sessionMeta}</p>
        </div>
      </aside>

      {settingsOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <SettingsPanel
              layout="modal"
              onClose={() => setSettingsOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
