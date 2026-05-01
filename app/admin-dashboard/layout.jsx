import Link from "next/link";
import {
  LayoutGrid,
  Users,
  NotebookPen,
  CheckCircle2,
  Settings,
} from "lucide-react";
import styles from "./layout.module.css";

export default function AdminDashboardLayout({ children }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <p className={styles.kicker}>Admin panel</p>
          <h2 className={styles.title}>PKL Notes</h2>
          <p className={styles.subtitle}>
            Simple review workspace for admin tasks and note oversight.
          </p>
        </div>
        <nav className={styles.nav}>
          <Link
            href="/admin-dashboard"
            className={`${styles.navLink} ${styles.active}`}
          >
            <LayoutGrid size={18} />
            Overview
          </Link>
          <span className={styles.navLink}>
            <Users size={18} />
            Users
          </span>
          <span className={styles.navLink}>
            <NotebookPen size={18} />
            Notes
          </span>
          <span className={styles.navLink}>
            <CheckCircle2 size={18} />
            Approvals
          </span>
          <Link href="/admin-dashboard/settings" className={styles.navLink}>
            <Settings size={18} />
            Settings
          </Link>
        </nav>
        <div className={styles.sessionCard}>
          <p className={styles.sessionLabel}>Session</p>
          <p className={styles.sessionTitle}>Admin review mode</p>
          <p className={styles.sessionMeta}>Last sync: just now</p>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
