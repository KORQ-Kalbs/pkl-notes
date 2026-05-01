"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { setAuthCookies } from "../../lib/authCookies";
import { ensureUserProfile } from "../../lib/userProfile";
import Button from "../../components/Button";
import Input from "../../components/Input";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: form.email,
        password: form.password,
      },
    );

    if (signInError) {
      const message = signInError.message.toLowerCase();
      if (message.includes("email not confirmed")) {
        setError(
          "Your account is not confirmed yet. Please check your email, then try again.",
        );
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    const authUser = data.user ?? data.session?.user;

    if (!authUser) {
      setError("Unable to read user session. Please try again.");
      setLoading(false);
      return;
    }

    setAuthCookies(data.session);

    const { profile, error: profileError } = await ensureUserProfile(
      supabase,
      authUser,
    );

    if (profileError) {
      console.error("Profile lookup failed:", profileError);
      setError("Unable to load your account profile. Please try again.");
      setLoading(false);
      return;
    }

    router.push(profile?.role ? "/admin-dashboard" : "/dashboard");
  };

  const handleResendConfirmation = async () => {
    if (!form.email) {
      setError("Enter your email first to resend the confirmation link.");
      return;
    }

    setResending(true);
    setError("");
    setInfo("");

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: form.email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (resendError) {
      setError(resendError.message);
      setResending(false);
      return;
    }

    setInfo("Confirmation email sent. Please check inbox and spam folder.");
    setResending(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.kicker}>Welcome back</p>
          <h1 className={styles.title}>Sign in to PKL Notes</h1>
          <p className={styles.subtitle}>
            Continue your internship log with a clear daily rhythm.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@school.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your secure password"
            required
          />
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        {error ? <p className={styles.error}>{error}</p> : null}
        {info ? <p className={styles.info}>{info}</p> : null}
        <button
          type="button"
          className={styles.inlineAction}
          onClick={handleResendConfirmation}
          disabled={resending}
        >
          {resending ? "Resending..." : "Resend confirmation email"}
        </button>
        <p className={styles.helper}>
          New here?{" "}
          <Link className={styles.link} href="/register">
            Create an account
          </Link>
        </p>
        <Link className={styles.backLink} href="/">
          Back to home
        </Link>
      </div>
      <div className={styles.panel}>
        <h2>Daily clarity, every day</h2>
        <p>
          Track activities, reflections, and plans with a minimal layout
          designed for fast writing and effortless review.
        </p>
        <div className={styles.panelGrid}>
          <div>
            <span>Structured entries</span>
            <p>Keep titles, summaries, and reflections in sync.</p>
          </div>
          <div>
            <span>Review status</span>
            <p>Know what is pending, approved, or flagged.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
