import AccountSettings from "../../../components/AccountSettings";

export default function AdminSettingsPage() {
  return (
    <AccountSettings
      title="Admin account"
      subtitle="Manage your admin session, update your password, or sign out."
      backHref="/admin-dashboard"
    />
  );
}
