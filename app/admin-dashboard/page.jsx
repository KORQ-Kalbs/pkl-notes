"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import styles from "./page.module.css";

export default function AdminDashboardPage() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    setError("");

    const { data, error: notesError } = await supabase
      .from("pkl_notes")
      .select(
        "id, title, summary, status, note_date, location, users_id, activities, reflection, next_plan, users:users_id ( id )",
      )
      .order("created_at", { ascending: false });

    if (notesError) {
      setError("Unable to load notes.");
      setNotes([]);
      setSelected(null);
      setLoading(false);
      return;
    }

    setNotes(data || []);
    setSelected(data?.[0] ?? null);
    setLoading(false);
  };

  const counts = useMemo(() => {
    return notes.reduce(
      (acc, note) => {
        if (note.status === "pending") acc.pending += 1;
        if (note.status === "approved") acc.approved += 1;
        if (note.status === "flagged") acc.flagged += 1;
        return acc;
      },
      { pending: 0, approved: 0, flagged: 0 },
    );
  }, [notes]);

  const queue = notes.filter((note) =>
    ["pending", "flagged", "hold"].includes(note.status),
  );

  const handleStatus = async (nextStatus) => {
    if (!selected) {
      return;
    }

    const { error: updateError } = await supabase
      .from("pkl_notes")
      .update({ status: nextStatus })
      .eq("id", selected.id);

    if (updateError) {
      setError("Unable to update status.");
      return;
    }

    setNotes((prev) =>
      prev.map((note) =>
        note.id === selected.id ? { ...note, status: nextStatus } : note,
      ),
    );
    setSelected((prev) => (prev ? { ...prev, status: nextStatus } : prev));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Dashboard</p>
          <h1>Overview and moderation queue</h1>
        </div>
        <Link href="/dashboard" className={styles.userLink}>
          User dashboard
        </Link>
      </header>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <p>Pending</p>
          <h2>{counts.pending}</h2>
        </div>
        <div className={styles.statCard}>
          <p>Approved</p>
          <h2>{counts.approved}</h2>
        </div>
        <div className={styles.statCard}>
          <p>Flagged</p>
          <h2>{counts.flagged}</h2>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.primaryColumn}>
          <section className={styles.queueCard}>
            <div className={styles.queueHeader}>
              <div>
                <p className={styles.queueLabel}>Queue</p>
                <h2>Notes to review</h2>
              </div>
              <span className={styles.queueCount}>{queue.length} items</span>
            </div>
            {loading ? (
              <p className={styles.muted}>Loading queue...</p>
            ) : queue.length === 0 ? (
              <p className={styles.muted}>No items waiting for review.</p>
            ) : (
              <div className={styles.queueList}>
                {queue.map((note) => {
                  const name = note.users?.id
                    ? `User ${note.users.id}`
                    : `User ${note.users_id}`;
                  return (
                    <button
                      type="button"
                      key={note.id}
                      className={`${styles.queueItem} ${
                        selected?.id === note.id ? styles.queueItemActive : ""
                      }`}
                      onClick={() => setSelected(note)}
                    >
                      <div>
                        <p className={styles.queueName}>{name}</p>
                        <p className={styles.queueTitle}>{note.title}</p>
                      </div>
                      <Badge variant={note.status}>{note.status}</Badge>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <div>
                <p className={styles.queueLabel}>Review</p>
                <h2>Selected note</h2>
              </div>
              <div className={styles.detailActions}>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleStatus("approved")}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStatus("flagged")}
                >
                  Flag
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStatus("hold")}
                >
                  Hold
                </Button>
              </div>
            </div>
            {selected ? (
              <div className={styles.detailBody}>
                <div>
                  <p className={styles.detailMeta}>{selected.note_date}</p>
                  <h3>{selected.title}</h3>
                  <p className={styles.detailSummary}>{selected.summary}</p>
                </div>
                <div className={styles.detailGrid}>
                  <div>
                    <span>Activities</span>
                    <p>{selected.activities}</p>
                  </div>
                  <div>
                    <span>Reflection</span>
                    <p>{selected.reflection}</p>
                  </div>
                  <div>
                    <span>Next plan</span>
                    <p>{selected.next_plan}</p>
                  </div>
                  <div>
                    <span>Location</span>
                    <p>{selected.location}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className={styles.muted}>Select a note to review.</p>
            )}
            {error ? <p className={styles.error}>{error}</p> : null}
          </section>
        </div>

        <div className={styles.secondaryColumn}>
          <section className={styles.actionCard}>
            <p className={styles.queueLabel}>Actions</p>
            <h3>Review approvals</h3>
            <Button variant="primary" size="lg" className={styles.actionButton}>
              Review approvals
            </Button>
            <Button variant="ghost" size="lg" className={styles.actionButton}>
              Manage users
            </Button>
          </section>

          <section className={styles.statusCard}>
            <p className={styles.queueLabel}>Status</p>
            <p>
              This is a plain black admin shell with sidebar navigation, ready
              for backend wiring.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
