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
  "inline-flex min-h-[44px] items-center gap-3 rounded-lg border border-transparent px-4 py-3 text-[13px] text-text-secondary transition-all duration-200 hover:text-text-primary hover:border-border-color hover:bg-white/5 md:justify-center md:gap-0 md:px-3 lg:justify-start lg:gap-3 lg:px-4";
const activeLinkClass =
  "inline-flex min-h-[44px] items-center gap-3 rounded-lg border border-transparent px-4 py-3 text-[13px] text-text-secondary transition-all duration-200 hover:text-text-primary hover:border-border-color hover:bg-white/5 bg-white/5 border-border-color text-text-primary md:justify-center md:gap-0 md:px-3 lg:justify-start lg:gap-3 lg:px-4";

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

export default function Sidebar({
  variant = "user",
  mobileOpen = false,
  onClose,
}) {
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

  useEffect(() => {
    if (!mobileOpen || !onClose) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onClose]);

  const isActive = (href) =>
    pathname === href || (pathname?.startsWith(href) && href !== "/");

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const sidebarStateClass = mobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          aria-label="Close sidebar"
          onClick={handleNavClick}
        />
      ) : null}
      <aside
        id="sidebar-drawer"
        className={`fixed inset-y-0 left-0 z-40 flex w-[80vw] max-w-[300px] flex-col gap-8 overflow-y-auto border-r border-border-color bg-bg-secondary p-6 transition-transform duration-300 ease-out ${sidebarStateClass} md:w-20 md:translate-x-0 md:gap-6 md:p-4 lg:w-[var(--sidebar-width)] lg:p-10`}
      >
        <div className="grid gap-2 md:justify-items-center lg:justify-items-start">
          <p className="text-[12px] uppercase tracking-wider text-text-secondary md:hidden lg:block">
            {panelCopy.kicker}
          </p>
          <h2 className="font-display text-[18px] md:hidden lg:block">
            {panelCopy.title}
          </h2>
          <div className="hidden md:flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-border-color text-[12px] font-semibold text-text-primary">
            PKL
          </div>
          {panelCopy.description ? (
            <p className="text-[13px] text-text-secondary leading-5 md:hidden lg:block">
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
                title={item.label}
                onClick={handleNavClick}
                className={
                  isActive(item.href) ? activeLinkClass : baseLinkClass
                }
              >
                <Icon size={18} />
                <span className="md:hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            className={baseLinkClass}
            title="Settings"
            onClick={() => {
              setSettingsOpen(true);
              handleNavClick();
            }}
          >
            <Settings size={18} />
            <span className="md:hidden lg:inline">Settings</span>
          </button>
        </nav>
        <div className="grid gap-3 p-5 mt-auto border rounded-lg border-border-color bg-white/5 md:hidden lg:grid">
          <p className="text-[12px] uppercase tracking-wider text-text-secondary">
            Session
          </p>
          <p className="text-[14px] font-semibold leading-5">
            {panelCopy.sessionTitle}
          </p>
          <p className="text-[12px] text-text-secondary leading-5">
            {panelCopy.sessionMeta}
          </p>
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
