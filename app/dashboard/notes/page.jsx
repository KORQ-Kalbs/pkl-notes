"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { ensureUserProfile } from "../../../lib/userProfile";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import "../../globals.css";

const styles = {
  page: "min-h-screen py-18 px-[6vw] bg-bg-primary",
  header: "flex items-center justify-between mb-8",
  kicker: "text-kicker",
  subtitle: "text-text-secondary",
  formSection: "bg-bg-secondary p-6 rounded-lg border border-border-color",
  form: "grid gap-4",
  formGrid: "grid grid-cols-2 gap-4",
  formSpacer: "hidden md:block",
  field: "flex flex-col gap-2",
  span2: "col-span-2",
  textarea: "input-custom h-32 resize-none",
  error: "text-danger mt-4",
  info: "text-info mt-4",
};

const emptyForm = {
  note_date: "",
  title: "",
  summary: "",
  activities: "",
  reflection: "",
  next_plan: "",
  location: "",
};

export default function DashboardNotesPage() {
  const [profileId, setProfileId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
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
    setSubmitting(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>New note</p>
          <h1 className="font-display text-[2.2rem]">Create a new entry</h1>
          <p className={styles.subtitle}>
            Share your activity, reflection, and next plan.
          </p>
        </div>
      </header>

      <section className={styles.formSection}>
        {loading ? (
          <p className={styles.subtitle}>Loading profile...</p>
        ) : (
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
            {error ? <p className={styles.error}>{error}</p> : null}
            {info ? <p className={styles.info}>{info}</p> : null}
          </form>
        )}
      </section>
    </div>
  );
}
