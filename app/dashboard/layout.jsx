import Link from "next/link";
import { LayoutGrid, NotebookPen, ClipboardList, Settings } from "lucide-react";
import styles from "./layout.module.css";

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <p className={styles.kicker}>User workspace</p>
          <h2 className={styles.title}>PKL Notes</h2>
        </div>
        <nav className={styles.nav}>
          <Link
            href="/dashboard"
            className={`${styles.navLink} ${styles.active}`}
          >
            <LayoutGrid size={18} />
            Overview
          </Link>
          <Link href="/dashboard#new-note" className={styles.navLink}>
            <NotebookPen size={18} />
            New note
          </Link>
          <Link href="/dashboard#history" className={styles.navLink}>
            <ClipboardList size={18} />
            History
          </Link>
          <Link href="/dashboard/settings" className={styles.navLink}>
            <Settings size={18} />
            Settings
          </Link>
        </nav>
        <div className={styles.sessionCard}>
          <p className={styles.sessionLabel}>Session</p>
          <p className={styles.sessionTitle}>Daily entry mode</p>
          <p className={styles.sessionMeta}>Sync: just now</p>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
