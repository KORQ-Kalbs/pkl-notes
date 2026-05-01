"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const THEME_KEY = "pkl-notes-theme";

function GearIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19.4 13.5C19.45 13.01 19.45 12.49 19.4 12L21.13 10.65C21.29 10.52 21.33 10.29 21.22 10.1L19.58 7.26C19.47 7.07 19.24 6.99 19.04 7.06L17 7.88C16.61 7.58 16.19 7.34 15.73 7.16L15.42 5C15.39 4.79 15.21 4.63 15 4.63H9C8.79 4.63 8.61 4.79 8.58 5L8.27 7.16C7.81 7.34 7.39 7.58 7 7.88L4.96 7.06C4.76 6.99 4.53 7.07 4.42 7.26L2.78 10.1C2.67 10.29 2.71 10.52 2.87 10.65L4.6 12C4.55 12.49 4.55 13.01 4.6 13.5L2.87 14.85C2.71 14.98 2.67 15.21 2.78 15.4L4.42 18.24C4.53 18.43 4.76 18.51 4.96 18.44L7 17.62C7.39 17.92 7.81 18.16 8.27 18.34L8.58 20.5C8.61 20.71 8.79 20.87 9 20.87H15C15.21 20.87 15.39 20.71 15.42 20.5L15.73 18.34C16.19 18.16 16.61 17.92 17 17.62L19.04 18.44C19.24 18.51 19.47 18.43 19.58 18.24L21.22 15.4C21.33 15.21 21.29 14.98 21.13 14.85L19.4 13.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function PopupSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    return window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  });
  const rootRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function applyTheme(nextTheme) {
    setTheme(nextTheme);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Open settings"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-slate-700 transition hover:bg-white"
      >
        <GearIcon />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-30 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.2)] backdrop-blur-xl">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <span>Profile</span>
            <span className="text-xs text-slate-400">Soon</span>
          </button>

          <div className="my-1 h-px bg-slate-200" />

          <div className="px-3 py-2">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Theme
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyTheme("light")}
                className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                  theme === "light"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => applyTheme("dark")}
                className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                  theme === "dark"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="my-1 h-px bg-slate-200" />

          <Link
            href="/login"
            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            Log out
          </Link>
        </div>
      ) : null}
    </div>
  );
}
