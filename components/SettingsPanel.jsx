"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ensureUserProfile } from "../lib/userProfile";
import AccountSettings from "./AccountSettings";
import AdminSettings from "./AdminSettings";

const settingsCopy = {
  admin: {
    title: "Admin account",
    subtitle: "Manage your admin session, update your password, or sign out.",
    backHref: "/admin-dashboard",
    backLabel: "Back to admin dashboard",
  },
  user: {
    title: "User account",
    subtitle: "Change your password or sign out of your PKL Notes session.",
    backHref: "/dashboard",
    backLabel: "Back to dashboard",
  },
};

export default function SettingsPanel({ layout = "page", onClose }) {
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData?.user;

      if (!authUser) {
        setLoading(false);
        return;
      }

      const { profile, error: profileError } = await ensureUserProfile(
        supabase,
        authUser,
      );

      if (profileError || !profile) {
        console.error("Profile lookup failed:", profileError);
        setLoading(false);
        return;
      }

      setRole(profile.role ? "admin" : "user");
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  const copy = {
    ...settingsCopy[role],
    backLabel:
      layout === "modal" ? "Close settings" : settingsCopy[role].backLabel,
  };

  if (loading) {
    return (
      <div className="min-h-[240px] flex items-center justify-center">
        <p className="text-text-secondary">Loading your account settings...</p>
      </div>
    );
  }

  if (role === "admin") {
    return <AdminSettings {...copy} layout={layout} onClose={onClose} />;
  }

  return <AccountSettings {...copy} layout={layout} onClose={onClose} />;
}
