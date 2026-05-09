import Sidebar from "../../components/Sidebar";

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar variant="admin" />
      <main className="min-h-screen pb-16 p-14 md:ml-[270px]">{children}</main>
    </div>
  );
}
