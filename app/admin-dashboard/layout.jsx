import DashboardShell from "../../components/DashboardShell";

export default function AdminDashboardLayout({ children }) {
  return <DashboardShell variant="admin">{children}</DashboardShell>;
}
