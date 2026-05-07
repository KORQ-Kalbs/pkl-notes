"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ensureUserProfile } from "../../lib/userProfile";
import Badge from "../../components/Badge";
import "../globals.css";

const styles = {
  page: "min-h-screen py-18 px-[6vw] bg-bg-primary",
  header: "flex flex-col gap-3 mb-10",
  kicker: "text-kicker",
  subtitle: "text-text-secondary",
  stats: "grid gap-4 md:grid-cols-4",
  statCard: "card-custom",
  statLabel: "text-text-secondary text-sm",
  statValue: "text-[1.8rem] font-display",
  sectionHeader: "flex items-center justify-between mb-4",
  listSection: "mt-10",
  notesList: "grid gap-4",
  noteCard:
    "p-4 rounded-lg border border-border-color bg-white/5 flex items-start justify-between",
  noteDate: "text-sm text-text-secondary",
  noteSummary: "mt-2 text-text-secondary",
  noteMeta: "text-sm text-text-secondary",
  muted: "text-text-secondary",
  error: "text-danger",
};

const toDateKey = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString().slice(0, 10);
};

const calculateStreak = (notes) => {
  const dates = notes.map((note) => toDateKey(note.note_date)).filter(Boolean);

  const uniqueDates = Array.from(new Set(dates)).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  if (uniqueDates.length === 0) {
    return 0;
  }

  let streak = 1;
  let current = new Date(uniqueDates[0]);

  for (let i = 1; i < uniqueDates.length; i += 1) {
    const next = new Date(uniqueDates[i]);
    const diff = (current.getTime() - next.getTime()) / 86400000;

    if (diff === 1) {
      streak += 1;
      current = next;
    } else {
      break;
    }
  }

  return streak;
};

export default function DashboardPage() {
  const [notes, setNotes] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    setError("");

    const { data: authData } = await supabase.auth.getUser();
    const authUser = authData?.user;

    if (!authUser) {
      setError("No active session. Please sign in again.");
      setLoading(false);
      return;
    }

    const { profile, error: profileError } = await ensureUserProfile(
      supabase,
      authUser,
    );

    if (profileError || !profile) {
      setError("Profile not found. Please re-authenticate.");
      setLoading(false);
      return;
    }

    setProfileId(profile.id);

    const { data: notesData, error: notesError } = await supabase
      .from("pkl_notes")
      .select("id, note_date, title, summary, status, location, created_at")
      .eq("users_id", profile.id)
      .order("note_date", { ascending: false });

    if (notesError) {
      setError("Unable to load notes.");
    } else {
      setNotes(notesData || []);
    }

    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = notes.length;
    const pending = notes.filter((note) => note.status === "pending").length;
    const approved = notes.filter((note) => note.status === "approved").length;
    const streak = calculateStreak(notes);

    return { total, pending, approved, streak };
  }, [notes]);

  const recentNotes = useMemo(() => notes.slice(0, 5), [notes]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Dashboard</p>
        <h1 className="font-display text-[2.2rem]">Your overview</h1>
        <p className={styles.subtitle}>
          Track your consistency, pending approvals, and recent submissions.
        </p>
      </header>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Current streak</p>
          <p className={styles.statValue}>{stats.streak} days</p>
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
          <p className={styles.statLabel}>Approved</p>
          <p className={styles.statValue}>{stats.approved}</p>
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
          <p className={styles.muted}>No notes yet. Start a new entry.</p>
        ) : (
          <div className={styles.notesList}>
            {recentNotes.map((note) => (
              <article key={note.id} className={styles.noteCard}>
                <div>
                  <p className={styles.noteDate}>{note.note_date}</p>
                  <h3>{note.title}</h3>
                  <p className={styles.noteSummary}>{note.summary}</p>
                  <p className={styles.noteMeta}>{note.location}</p>
                </div>
                <Badge variant={note.status}>{note.status}</Badge>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
