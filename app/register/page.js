"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { setAuthCookies } from "../../lib/authCookies";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
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

  return (
    <main className="min-h-screen grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10 items-center px-[6vw] py-18 gradient-hero-light">
      <div className="card-custom p-10">
        <div className="mb-8">
          <p className="text-kicker mb-4">Create your space</p>
          <h1 className="font-display text-[2.2rem] mb-2">Start PKL Notes</h1>
          <p className="text-text-secondary">
            Build a clean internship log with daily structure and clarity.
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
            placeholder="Create a secure password"
            required
          />
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        {error ? <p className="mt-4 text-danger">{error}</p> : null}
        {info ? <p className="mt-4 text-info">{info}</p> : null}
        <p className="mt-5 text-text-secondary text-sm">
          Already registered?{" "}
          <Link className="text-warning font-semibold" href="/login">
            Sign in
          </Link>
        </p>
        <Link className="inline-flex mt-5 text-text-secondary text-xs" href="/">
          Back to home
        </Link>
      </div>
      <div className="bg-bg-secondary/70 border border-border-color rounded-[26px] p-10 text-text-secondary grid gap-6">
        <h2 className="text-text-primary font-display text-[1.8rem]">
          Built for PKL consistency
        </h2>
        <p>
          Create daily notes with activity, reflection, and next plan sections
          so nothing important gets lost during your internship.
        </p>
        <div className="grid gap-4">
          <div>
            <span className="text-text-primary font-semibold">
              Quick submissions
            </span>
            <p className="mt-1 text-sm">
              One focused form for every daily log.
            </p>
          </div>
          <div>
            <span className="text-text-primary font-semibold">Admin ready</span>
            <p className="mt-1 text-sm">
              Notes arrive in the review queue instantly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
