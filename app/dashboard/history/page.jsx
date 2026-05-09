"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { ensureUserProfile } from "../../../lib/userProfile";
import Badge from "../../../components/Badge";
import "../../globals.css";

const styles = {
  page: "min-h-screen py-18 px-[6vw] bg-bg-primary",
  header: "flex items-center justify-between mb-8",
  kicker: "text-kicker",
  subtitle: "text-text-secondary",
  sectionHeader: "flex items-center justify-between mb-4",
  muted: "text-text-secondary",
  notesList: "grid gap-4",
  noteCard:
    "p-4 rounded-lg border border-border-color bg-white/5 flex items-start justify-between",
  noteDate: "text-sm text-text-secondary",
  noteSummary: "mt-2 text-text-secondary",
  noteMeta: "text-sm text-text-secondary",
  error: "text-danger",
  editLink:
    "inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border-color text-sm font-semibold text-text-primary hover:bg-white/5 transition-colors",
};

export default function DashboardHistoryPage() {
  const [notes, setNotes] = useState([]);
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

    const { data: notesData, error: notesError } = await supabase
      .from("pkl_notes")
      .select("id, note_date, title, summary, status, location, created_at")
      .eq("users_id", profile.id)
      .order("note_date", { ascending: false });

    if (notesError) {
      setError("Unable to load notes.");
      setNotes([]);
      setLoading(false);
      return;
    }

    setNotes(notesData || []);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>History</p>
          <h1 className="font-display text-[2.2rem]">All submissions</h1>
          <p className={styles.subtitle}>
            Review every note you have submitted.
          </p>
        </div>
      </header>

      <section>
        <div className={styles.sectionHeader}>
          <h2>Notes</h2>
          <span className={styles.muted}>{notes.length} total</span>
        </div>

        {loading ? (
          <p className={styles.muted}>Loading notes...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : notes.length === 0 ? (
          <p className={styles.muted}>No notes yet. Create a new entry.</p>
        ) : (
          <div className={styles.notesList}>
            {notes.map((note) => (
              <article key={note.id} className={styles.noteCard}>
                <div>
                  <p className={styles.noteDate}>{note.note_date}</p>
                  <h3>{note.title}</h3>
                  <p className={styles.noteSummary}>{note.summary}</p>
                  <p className={styles.noteMeta}>{note.location}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Badge variant={note.status}>{note.status}</Badge>
                  <Link
                    className={styles.editLink}
                    href={`/dashboard/notes?edit=${note.id}`}
                  >
                    Edit
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
