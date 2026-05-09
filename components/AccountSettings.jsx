"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { clearAuthCookies } from "../lib/authCookies";
import Button from "./Button";
import Input from "./Input";

export default function AccountSettings({
  title,
  subtitle,
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
  layout = "page",
  onClose,
}) {
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const isModal = layout === "modal";
  const Wrapper = isModal ? "div" : "main";
  const wrapperClassName = isModal
    ? ""
    : "min-h-screen py-18 px-[6vw] bg-bg-primary";
  const cardClassName = isModal
    ? "card-custom w-full"
    : "card-custom w-[min(760px,100%)] mx-auto";

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

    try {
      await clearAuthCookies();
    } catch (sessionError) {
      setError(
        sessionError?.message || "Unable to clear the server session cookie.",
      );
      setSigningOut(false);
      return;
    }

    router.push("/login");
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
      return;
    }

    router.push(backHref);
  };

  return (
    <Wrapper className={wrapperClassName}>
      <div className={cardClassName}>
        <p className="text-kicker mb-4">Settings</p>
        <h1 className="font-display text-[2.2rem] mb-2">{title}</h1>
        <p className="text-text-secondary mb-6">{subtitle}</p>

        <section className="mt-6 p-4 rounded-lg border border-border-color bg-white/5">
          <span className="text-kicker">Current signed-in email</span>
          <p className="mt-2 text-text-primary break-words">
            {email || "Loading email..."}
          </p>
        </section>

        <section className="mt-8 pt-6 border-t border-border-color">
          <h2 className="text-lg mb-4">Change password</h2>
          <form className="grid gap-4" onSubmit={handlePasswordChange}>
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

        <section className="mt-8 pt-6 border-t border-border-color">
          <h2 className="text-lg mb-4">Session</h2>
          <div className="flex gap-4 flex-wrap">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </Button>
            <Button variant="outline" size="lg" onClick={handleBack}>
              {backLabel}
            </Button>
          </div>
        </section>

        {error ? <p className="mt-4 text-danger">{error}</p> : null}
        {info ? <p className="mt-4 text-info">{info}</p> : null}
      </div>
    </Wrapper>
  );
}
