"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import Card from "../components/Card";
import styles from "./page.module.css";

export default function HomePage() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);
      gsap.fromTo(
        q(`.${styles.heroTitle}`),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
      );
      gsap.fromTo(
        q(`.${styles.heroSubtitle}`),
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.15 },
      );
      gsap.fromTo(
        q(`.${styles.heroActions}`),
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.3 },
      );
      gsap.fromTo(
        q(`.${styles.heroPanels}`),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className={styles.page} ref={rootRef}>
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>PKL Notes Platform</span>
          <h1 className={styles.heroTitle}>
            Internship notes that feel premium, clean, and unmistakably yours.
          </h1>
          <p className={styles.heroSubtitle}>
            Capture daily PKL activities with clarity, get reviewed faster, and
            keep your learning narrative organized in one high polish space.
          </p>
          <div className={styles.heroActions}>
            <Link
              href="/register"
              className={`${styles.linkButton} ${styles.primaryButton}`}
            >
              Get started
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className={`${styles.linkButton} ${styles.ghostButton}`}
            >
              I already have access
            </Link>
          </div>
          <div className={styles.heroMeta}>
            <div className={styles.metaItem}>
              <Sparkles size={16} />
              Designed for daily focus
            </div>
            <div className={styles.metaItem}>Supabase secured workflow</div>
          </div>
        </div>
        <div className={styles.heroPanels}>
          <Card className={styles.panel}>
            <p className={styles.panelKicker}>Today</p>
            <h3 className={styles.panelTitle}>Workshop activity log</h3>
            <p className={styles.panelText}>
              Streamlined entries, smarter reflections, and a clear next step
              for every internship day.
            </p>
            <div className={styles.statusRow}>
              <span className={styles.statusDot} />
              Pending review
            </div>
          </Card>
          <Card className={styles.panelAlt}>
            <p className={styles.panelKicker}>Admin queue</p>
            <h3 className={styles.panelTitle}>Moderation ready</h3>
            <ul className={styles.panelList}>
              <li>Daily summaries in one view</li>
              <li>Flags, approvals, and hold notes</li>
              <li>Clear review actions</li>
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}
