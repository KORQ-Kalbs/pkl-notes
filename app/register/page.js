"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { setAuthCookies } from "../../lib/authCookies";
import Button from "../../components/Button";
import Input from "../../components/Input";
import styles from "./page.module.css";

export default function RegisterPage() {
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

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) {
      console.error("Signup failed:", signUpError);
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      setAuthCookies(data.session);
      router.push("/dashboard");
      return;
    }

    setInfo(
      "Account created. If email confirmation is enabled, check your inbox and sign in after confirming.",
    );
    setLoading(false);
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
          <p className={styles.kicker}>Create your space</p>
          <h1 className={styles.title}>Start PKL Notes</h1>
          <p className={styles.subtitle}>
            Build a clean internship log with daily structure and clarity.
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
            placeholder="Create a secure password"
            required
          />
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
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
          Already registered?{" "}
          <Link className={styles.link} href="/login">
            Sign in
          </Link>
        </p>
        <Link className={styles.backLink} href="/">
          Back to home
        </Link>
      </div>
      <div className={styles.panel}>
        <h2>Built for PKL consistency</h2>
        <p>
          Create daily notes with activity, reflection, and next plan sections
          so nothing important gets lost during your internship.
        </p>
        <div className={styles.panelGrid}>
          <div>
            <span>Quick submissions</span>
            <p>One focused form for every daily log.</p>
          </div>
          <div>
            <span>Admin ready</span>
            <p>Notes arrive in the review queue instantly.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
