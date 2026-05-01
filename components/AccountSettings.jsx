"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Button from "./Button";
import Input from "./Input";
import styles from "./accountSettings.module.css";

export default function AccountSettings({
  title,
  subtitle,
  backHref = "/dashboard",
}) {
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const loadEmail = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data?.user?.email || "");
    };

    loadEmail();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: form.newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setForm({ currentPassword: "", newPassword: "" });
    setInfo("Password updated successfully.");
    setLoading(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setError("");

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      setSigningOut(false);
      return;
    }

    router.push("/login");
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.kicker}>Settings</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <section className={styles.profileCard}>
          <span className={styles.profileLabel}>Current signed-in email</span>
          <p className={styles.profileValue}>{email || "Loading email..."}</p>
        </section>

        <section className={styles.section}>
          <h2>Change password</h2>
          <form className={styles.form} onSubmit={handlePasswordChange}>
            <Input
              label="New password"
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update password"}
            </Button>
          </form>
        </section>

        <section className={styles.section}>
          <h2>Session</h2>
          <div className={styles.actionsRow}>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push(backHref)}
            >
              Back to dashboard
            </Button>
          </div>
        </section>

        {error ? <p className={styles.error}>{error}</p> : null}
        {info ? <p className={styles.info}>{info}</p> : null}
      </div>
    </main>
  );
}
