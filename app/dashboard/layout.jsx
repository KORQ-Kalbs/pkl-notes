import "../globals.css";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-[270px_1fr] bg-bg-primary">
      <Sidebar variant="user" />
      <main className="pb-16 p-14">{children}</main>
    </div>
  );
}
