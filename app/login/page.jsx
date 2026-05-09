"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { setAuthCookies } from "../../lib/authCookies";
import { getUserProfile } from "../../lib/userProfile";
import Button from "../../components/Button";
import Input from "../../components/Input";

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

    try {
      await setAuthCookies(data.session);
    } catch (sessionError) {
      setError(
        sessionError?.message || "Unable to persist session. Please try again.",
      );
      setLoading(false);
      return;
    }

    const { profile, error: profileError } = await getUserProfile(
      supabase,
      authUser,
    );

    if (profileError || !profile) {
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
    <main className="min-h-screen grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10 items-center px-[6vw] py-18 gradient-hero-light">
      <div className="p-10 card-custom">
        <div className="mb-8">
          <p className="mb-4 text-kicker">Welcome back</p>
          <h1 className="font-display text-[2.2rem] mb-2">
            Sign in to PKL Notes
          </h1>
          <p className="text-text-secondary">
            Continue your internship log with a clear daily rhythm.
          </p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
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
        {error ? <p className="mt-4 text-danger">{error}</p> : null}
        {info ? <p className="mt-4 text-info">{info}</p> : null}
        <button
          type="button"
          className="p-0 mt-3 font-semibold bg-transparent border-0 cursor-pointer text-warning disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleResendConfirmation}
          disabled={resending}
        >
          {resending ? "Resending..." : "Resend confirmation email"}
        </button>
        <p className="mt-5 text-sm text-text-secondary">
          New here?{" "}
          <Link className="font-semibold text-warning" href="/register">
            Create an account
          </Link>
        </p>
        <Link className="inline-flex mt-5 text-xs text-text-secondary" href="/">
          Back to home
        </Link>
      </div>
      <div className="bg-bg-secondary/70 border border-border-color rounded-[26px] p-10 text-text-secondary grid gap-6">
        <h2 className="text-text-primary font-display text-[1.8rem]">
          Daily clarity, every day
        </h2>
        <p>
          Track activities, reflections, and plans with a minimal layout
          designed for fast writing and effortless review.
        </p>
        <div className="grid gap-4">
          <div>
            <span className="font-semibold text-text-primary">
              Structured entries
            </span>
            <p className="mt-1 text-sm">
              Keep titles, summaries, and reflections in sync.
            </p>
          </div>
          <div>
            <span className="font-semibold text-text-primary">
              Review status
            </span>
            <p className="mt-1 text-sm">
              Know what is pending, approved, or flagged.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
