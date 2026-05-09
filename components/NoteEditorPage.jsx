"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import { ensureUserProfile } from "../lib/userProfile";
import Button from "./Button";
import Input from "./Input";

const emptyForm = {
  note_date: "",
  title: "",
  summary: "",
  activities: "",
  reflection: "",
  next_plan: "",
  location: "",
};

export default function NoteEditorPage({
  backHref,
  backLabel,
  kicker,
  title,
  subtitle,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [profileId, setProfileId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadEditorState = async () => {
      setLoading(true);
      setError("");
      setInfo("");

      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData?.user;

      if (!authUser) {
        if (mounted) {
          setError("No active session. Please sign in again.");
          setLoading(false);
        }
        return;
      }

      if (editId) {
        const { data: note, error: noteError } = await supabase
          .from("pkl_notes")
          .select(
            "id, users_id, note_date, title, summary, activities, reflection, next_plan, location",
          )
          .eq("id", editId)
          .maybeSingle();

        if (noteError || !note) {
          if (mounted) {
            setError("Unable to load the selected note.");
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setEditingNoteId(note.id);
          setProfileId(note.users_id);
          setForm({
            note_date: note.note_date || "",
            title: note.title || "",
            summary: note.summary || "",
            activities: note.activities || "",
            reflection: note.reflection || "",
            next_plan: note.next_plan || "",
            location: note.location || "",
          });
          setLoading(false);
        }
        return;
      }

      const { profile, error: profileError } = await ensureUserProfile(
        supabase,
        authUser,
      );

      if (profileError || !profile) {
        if (mounted) {
          setError("Profile not found. Please re-authenticate.");
          setLoading(false);
        }
        return;
      }

      if (mounted) {
        setProfileId(profile.id);
        setLoading(false);
      }
    };

    loadEditorState();

    return () => {
      mounted = false;
    };
  }, [editId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setInfo("");

    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    };

    if (editingNoteId) {
      const { error: updateError } = await supabase
        .from("pkl_notes")
        .update(payload)
        .eq("id", editingNoteId);

      if (updateError) {
        setError("Unable to update note. Please try again.");
        setSubmitting(false);
        return;
      }

      setInfo("Note updated successfully.");
      setSubmitting(false);
      return;
    }

    if (!profileId) {
      setError("Unable to submit without a profile.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("pkl_notes").insert({
      ...payload,
      users_id: profileId,
      status: "pending",
    });

    if (insertError) {
      setError("Unable to submit note. Please try again.");
      setSubmitting(false);
      return;
    }

    setForm(emptyForm);
    setInfo("Note submitted for review.");
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!editingNoteId) {
      return;
    }

    setDeleting(true);
    setError("");

    // Diagnostic: who is the current auth user?
    try {
      const { data: authData } = await supabase.auth.getUser();
      console.log("Delete diagnostics - auth user:", authData?.user || null);
    } catch (e) {
      console.warn("Unable to read auth user before delete", e);
    }

    // Diagnostic: fetch the note to confirm ownership
    try {
      const { data: noteBefore, error: noteErr } = await supabase
        .from("pkl_notes")
        .select("id, users_id, title")
        .eq("id", editingNoteId)
        .maybeSingle();

      if (noteErr) {
        console.warn("Unable to fetch note before delete:", noteErr);
      } else {
        console.log(
          "Delete diagnostics - note before delete:",
          noteBefore || null,
        );
      }
    } catch (e) {
      console.warn("Exception fetching note before delete", e);
    }

    // Diagnostic: fetch current profile mapping (users table) for auth.uid()
    let currentProfile = null;
    try {
      const { data: authData } = await supabase.auth.getUser();
      const authUid = authData?.user?.id;
      const { data: profileData, error: profileErr } = await supabase
        .from("users")
        .select("id, role, email_user")
        .eq("email_user", authUid)
        .maybeSingle();

      if (profileErr) {
        console.warn("Unable to fetch current profile:", profileErr);
      } else {
        currentProfile = profileData || null;
        console.log("Delete diagnostics - current profile:", currentProfile);
      }
    } catch (e) {
      console.warn("Exception fetching current profile", e);
    }

    // If we have the note and profile, ensure the user is owner or admin before attempting delete.
    if (currentProfile && typeof currentProfile.id !== "undefined") {
      try {
        const { data: noteCheck } = await supabase
          .from("pkl_notes")
          .select("id, users_id")
          .eq("id", editingNoteId)
          .maybeSingle();

        if (
          noteCheck &&
          noteCheck.users_id !== currentProfile.id &&
          !currentProfile.role
        ) {
          setDeleteErrorMsg("You are not allowed to delete this note.");
          setDeleting(false);
          return;
        }
      } catch (e) {
        console.warn("Exception during ownership check", e);
      }
    }

    try {
      const res = await supabase
        .from("pkl_notes")
        .delete()
        .select()
        .eq("id", editingNoteId);

      if (res.error) {
        console.error("Delete failed:", res.error);
        setDeleteErrorMsg(res.error.message || "Unable to delete note.");
        setDeleting(false);
        return;
      }

      // If no rows returned, still treat as success but warn
      if (!res.data || res.data.length === 0) {
        console.warn("Delete returned no rows, but no error.");
      }

      setDeleting(false);
      setDeleteOpen(false);
      router.push(backHref);
    } catch (ex) {
      console.error("Delete exception:", ex);
      setDeleteErrorMsg(ex?.message || "Unexpected error while deleting.");
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen py-18 px-[6vw] bg-bg-primary">
      <header className="flex flex-wrap items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-kicker">{kicker}</p>
          <h1 className="font-display text-[2.2rem]">
            {editingNoteId ? "Update this entry" : title}
          </h1>
          <p className="mt-2 text-text-secondary">{subtitle}</p>
        </div>
        <Button variant="outline" onClick={() => router.push(backHref)}>
          {backLabel}
        </Button>
      </header>

      <section className="p-6 border rounded-lg bg-bg-secondary border-border-color">
        {loading ? (
          <p className="text-text-secondary">Loading note editor...</p>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="hidden md:block" />
              <label className="flex flex-col col-span-2 gap-2">
                <span>Summary</span>
                <textarea
                  className="h-32 resize-none input-custom"
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  placeholder="Quick recap"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span>Activities</span>
                <textarea
                  className="h-32 resize-none input-custom"
                  name="activities"
                  value={form.activities}
                  onChange={handleChange}
                  placeholder="What did you do?"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span>Reflection</span>
                <textarea
                  className="h-32 resize-none input-custom"
                  name="reflection"
                  value={form.reflection}
                  onChange={handleChange}
                  placeholder="What did you learn?"
                  required
                />
              </label>
              <label className="flex flex-col col-span-2 gap-2">
                <span>Next plan</span>
                <textarea
                  className="h-32 resize-none input-custom"
                  name="next_plan"
                  value={form.next_plan}
                  onChange={handleChange}
                  placeholder="What is next?"
                  required
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
              >
                {submitting
                  ? editingNoteId
                    ? "Saving..."
                    : "Submitting..."
                  : editingNoteId
                    ? "Save changes"
                    : "Submit note"}
              </Button>
              {editingNoteId ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => router.push(backHref)}
                >
                  Cancel
                </Button>
              ) : null}
              {editingNoteId ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setDeleteErrorMsg("");
                    setDeleteOpen(true);
                  }}
                >
                  Delete note
                </Button>
              ) : null}
            </div>

            {error ? <p className="text-danger">{error}</p> : null}
            {info ? <p className="text-info">{info}</p> : null}
          </form>
        )}
      </section>

      {deleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60">
          <div className="w-full max-w-md rounded-[24px] border border-border-color bg-bg-secondary p-6 shadow-card">
            <p className="text-kicker">Confirm delete</p>
            <h2 className="mt-2 text-[1.4rem] font-display">Are you sure?</h2>
            <p className="mt-3 text-text-secondary">
              This note will be permanently deleted and cannot be restored.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Proceed delete"}
              </Button>
            </div>
            {deleteErrorMsg ? (
              <p className="mt-4 text-danger">{deleteErrorMsg}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
