"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import gsap from "gsap";
import Card from "../components/Card";

export default function HomePage() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);
      gsap.fromTo(
        q(".hero-title"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
      );
      gsap.fromTo(
        q(".hero-subtitle"),
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.15 },
      );
      gsap.fromTo(
        q(".hero-actions"),
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.3 },
      );
      gsap.fromTo(
        q(".hero-panels"),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      className="relative min-h-screen py-24 overflow-hidden gradient-hero"
      ref={rootRef}
    >
      <div className="orb-one" />
      <div className="orb-two" />
      <section className="w-[min(1120px,92vw)] mx-auto grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-14 items-center relative z-10">
        <div className="flex flex-col gap-[1.4rem]">
          <span className="text-kicker">PKL Notes Platform</span>
          <h1 className="hero-title font-display text-[clamp(2.8rem,4.5vw,4.4rem)] leading-[1.05]">
            Internship notes that feel premium, clean, and unmistakably yours.
          </h1>
          <p className="hero-subtitle text-lg max-w-[36rem] text-text-secondary">
            Capture daily PKL activities with clarity, get reviewed faster, and
            keep your learning narrative organized in one high polish space.
          </p>
          <div className="hero-actions flex gap-4 flex-wrap mt-1">
            <Link href="/register" className="btn-primary">
              Get started
              <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-ghost">
              I already have access
            </Link>
          </div>
          <div className="flex gap-6 flex-wrap text-sm text-text-secondary items-center">
            <div className="inline-flex items-center gap-2">
              <Sparkles size={16} />
              Designed for daily focus
            </div>
            <div>Supabase secured workflow</div>
          </div>
        </div>
        <div className="hero-panels grid gap-6">
          <Card className="bg-bg-secondary/95 border border-border-color rounded-[26px] p-6 shadow-card">
            <p className="text-kicker mb-2">Today</p>
            <h3 className="text-xl mb-2">Workshop activity log</h3>
            <p className="text-text-secondary text-sm mb-5">
              Streamlined entries, smarter reflections, and a clear next step
              for every internship day.
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <span className="status-dot status-warning" />
              Pending review
            </div>
          </Card>
          <Card className="bg-bg-secondary/70 border border-border-color rounded-[26px] p-6 text-text-secondary">
            <p className="text-kicker mb-2">Admin queue</p>
            <h3 className="text-xl mb-2 text-text-primary">Moderation ready</h3>
            <ul className="list-none grid gap-2 text-sm">
              <li>Daily summaries in one view</li>
              <li>Flags, approvals, and hold notes</li>
              <li>Clear review actions</li>
            </ul>
          </Card>
        </div>
      </section>

      <footer className="w-[min(1120px,92vw)] mx-auto mt-16 pt-6 border-t border-border-color/60 relative z-10 flex flex-col gap-4 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright by KORQ-Kalbs</p>
        <Link
          href="https://github.com/KORQ-Kalbs"
          target="_blank"
          rel="noreferrer"
          aria-label="KORQ-Kalbs on GitHub"
          className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border-color bg-bg-secondary/70 text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
        >
          <Github size={18} />
        </Link>
      </footer>
    </main>
  );
}
