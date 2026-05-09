import { Suspense } from "react";
import NoteEditorPage from "../../../components/NoteEditorPage";

export default function AdminNotesPage() {
  return (
    <Suspense
      fallback={
        <p className="p-6 text-text-secondary">Loading note editor...</p>
      }
    >
      <NoteEditorPage
        backHref="/admin-dashboard/history"
        backLabel="Back to admin history"
        kicker="Admin note editor"
        title="Edit any submission"
        subtitle="Review and update note content across the workspace."
      />
    </Suspense>
  );
}
