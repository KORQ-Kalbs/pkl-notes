"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
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
};

export default function AdminHistoryPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    setError("");

    const { data: notesData, error: notesError } = await supabase
      .from("pkl_notes")
      .select(
        "id, note_date, title, summary, status, location, created_at, users_id",
      )
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
          <h1 className="font-display text-[2.2rem]">All user notes</h1>
          <p className={styles.subtitle}>
            Review every submission across the workspace.
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
          <p className={styles.muted}>No notes available.</p>
        ) : (
          <div className={styles.notesList}>
            {notes.map((note) => (
              <article key={note.id} className={styles.noteCard}>
                <div>
                  <p className={styles.noteDate}>{note.note_date}</p>
                  <h3>{note.title}</h3>
                  <p className={styles.noteSummary}>{note.summary}</p>
                  <p className={styles.noteMeta}>User ID: {note.users_id}</p>
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
