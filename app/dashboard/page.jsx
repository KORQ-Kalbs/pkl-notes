"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ensureUserProfile } from "../../lib/userProfile";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import Input from "../../components/Input";
import styles from "./page.module.css";

const emptyForm = {
  note_date: "",
  title: "",
  summary: "",
  activities: "",
  reflection: "",
  next_plan: "",
  location: "",
};

export default function DashboardPage() {
  const [notes, setNotes] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setInfo("");

    if (!profileId) {
      setError("Unable to submit without a profile.");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      users_id: profileId,
      status: "pending",
      updated_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from("pkl_notes")
      .insert(payload);

    if (insertError) {
      console.error("Note insert failed:", insertError);
      setError("Unable to submit note. Please try again.");
      setSubmitting(false);
      return;
    }

    setForm(emptyForm);
    setInfo("Note submitted for review.");
    await loadNotes();
    setSubmitting(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Dashboard</p>
          <h1>Daily PKL Notes</h1>
          <p className={styles.subtitle}>
            Track your daily activity and monitor approval status.
          </p>
        </div>
        <Button variant="ghost" size="sm">
          Sync now
        </Button>
      </header>

      <div className={styles.grid}>
        <section id="history" className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <h2>Submission history</h2>
            <span>{notes.length} entries</span>
          </div>
          {loading ? (
            <p className={styles.muted}>Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className={styles.muted}>No notes yet. Submit your first log.</p>
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
                  <Badge variant={note.status}>{note.status}</Badge>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="new-note" className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2>Submit a new note</h2>
            <span>All fields required</span>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <Input
                label="Date"
                type="date"
                name="note_date"
                value={form.note_date}
                onChange={handleChange}
                required
              />
              <Input
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Daily focus"
                required
              />
              <Input
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Office or placement"
                required
              />
              <div className={styles.formSpacer} />
              <label className={`${styles.field} ${styles.span2}`}>
                <span>Summary</span>
                <textarea
                  className={styles.textarea}
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  placeholder="Quick recap"
                  required
                />
              </label>
              <label className={styles.field}>
                <span>Activities</span>
                <textarea
                  className={styles.textarea}
                  name="activities"
                  value={form.activities}
                  onChange={handleChange}
                  placeholder="What did you do?"
                  required
                />
              </label>
              <label className={styles.field}>
                <span>Reflection</span>
                <textarea
                  className={styles.textarea}
                  name="reflection"
                  value={form.reflection}
                  onChange={handleChange}
                  placeholder="What did you learn?"
                  required
                />
              </label>
              <label className={`${styles.field} ${styles.span2}`}>
                <span>Next plan</span>
                <textarea
                  className={styles.textarea}
                  name="next_plan"
                  value={form.next_plan}
                  onChange={handleChange}
                  placeholder="What is next?"
                  required
                />
              </label>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit note"}
            </Button>
          </form>
          {error ? <p className={styles.error}>{error}</p> : null}
          {info ? <p className={styles.info}>{info}</p> : null}
        </section>
      </div>
    </div>
  );
}
