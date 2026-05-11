import "../globals.css";
import DashboardShell from "../../components/DashboardShell";

export default function DashboardLayout({ children }) {
  return <DashboardShell variant="user">{children}</DashboardShell>;
}
