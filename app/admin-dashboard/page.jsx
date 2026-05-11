"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../globals.css";

const styles = {
  page: "min-h-screen py-12 sm:py-14 lg:py-18 px-4 sm:px-6 lg:px-[6vw] bg-bg-primary",
  header: "flex flex-col gap-3 mb-8 sm:mb-10",
  kicker: "text-kicker",
  subtitle: "text-text-secondary",
  stats: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
  statCard: "card-custom",
  statLabel: "text-text-secondary text-sm",
  statValue: "text-[1.8rem] font-display",
  sectionHeader:
    "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4",
  listSection: "mt-10",
  notesList: "grid gap-4",
  noteCard:
    "p-4 rounded-lg border border-border-color bg-white/5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between min-w-0",
  noteDate: "text-sm text-text-secondary",
  noteSummary: "mt-2 text-text-secondary break-words",
  noteMeta: "text-sm text-text-secondary break-words",
  muted: "text-text-secondary",
  error: "text-danger",
};

export default function AdminDashboardPage() {
  const [notes, setNotes] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError("");

    const [{ data: notesData, error: notesError }, usersResult] =
      await Promise.all([
        supabase
          .from("pkl_notes")
          .select("id, note_date, title, summary, status, location, created_at")
          .order("note_date", { ascending: false }),
        supabase.from("users").select("id", { count: "exact", head: true }),
      ]);

    if (notesError) {
      setError("Unable to load notes.");
    }

    if (usersResult.error) {
      setError("Unable to load users.");
    }

    setNotes(notesData || []);
    setUsersCount(usersResult.count || 0);
    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = notes.length;
    const pending = notes.filter((note) => note.status === "pending").length;
    const approved = notes.filter((note) => note.status === "approved").length;
    const flagged = notes.filter((note) => note.status === "flagged").length;

    return { total, pending, approved, flagged };
  }, [notes]);

  const recentNotes = useMemo(() => notes.slice(0, 5), [notes]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Admin overview</p>
        <h1 className="font-display text-[2.2rem]">Workspace pulse</h1>
        <p className={styles.subtitle}>
          Monitor submissions, approvals, and active users across the system.
        </p>
      </header>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Registered users</p>
          <p className={styles.statValue}>{usersCount}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total notes</p>
          <p className={styles.statValue}>{stats.total}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Pending review</p>
          <p className={styles.statValue}>{stats.pending}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Flagged</p>
          <p className={styles.statValue}>{stats.flagged}</p>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent notes</h2>
          <span className={styles.muted}>{notes.length} total</span>
        </div>

        {loading ? (
          <p className={styles.muted}>Loading notes...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : recentNotes.length === 0 ? (
          <p className={styles.muted}>No notes available.</p>
        ) : (
          <div className={styles.notesList}>
            {recentNotes.map((note) => (
              <article key={note.id} className={styles.noteCard}>
                <div className="min-w-0">
                  <p className={styles.noteDate}>{note.note_date}</p>
                  <h3>{note.title}</h3>
                  <p className={styles.noteSummary}>{note.summary}</p>
                  <p className={styles.noteMeta}>{note.location}</p>
                </div>
                <span className={styles.muted}>{note.status}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
