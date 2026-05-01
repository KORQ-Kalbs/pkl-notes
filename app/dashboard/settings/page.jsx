import AccountSettings from "../../../components/AccountSettings";

export default function DashboardSettingsPage() {
  return (
    <AccountSettings
      title="User account"
      subtitle="Change your password or sign out of your PKL Notes session."
      backHref="/dashboard"
    />
  );
}
