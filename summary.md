# PKL Notes - Ultimate AI Context & Application Summary

This document serves as the absolute, single source of truth for the **PKL Notes** application. Any AI reading this file will immediately understand the architecture, database schema, design system, routing, and overall philosophy of the application because it includes **exact code snippets** from the current repository state.

## 📌 1. Application Overview & Context

**Name:** PKL Notes
**Purpose:** A premium, web-based platform for interns (PKL - Praktik Kerja Lapangan) to log their daily activities, reflections, and plans. It also features a secure admin portal for reviewers to read, approve, flag, or hold these notes.
**Design Philosophy:** "Expensive", clean, minimalist, and dynamic. The UI prioritizes a sleek dark mode by default with GSAP-powered micro-interactions.

---

## 📂 2. Exact Directory Structure

```text
/
├── app/
│   ├── admin-dashboard/     
│   ├── dashboard/           
│   ├── login/               
│   ├── register/            
│   ├── globals.css          # Core CSS variables and resets
│   ├── layout.jsx           # Root layout with fonts
│   ├── page.jsx             # Landing Page
│   └── page.module.css      
├── components/              
├── lib/
│   └── supabase.js          
├── middleware.js            # Route protection
├── supabase_setup.sql       
└── package.json             
```

---

## 💻 3. Global Layout & Fonts (`app/layout.jsx`)

The application enforces a strictly curated typography using Google Fonts `Space Grotesk` (display) and `Plus Jakarta Sans` (body). The default theme is explicitly set to `dark`.

```jsx
import "./globals.css";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "PKL Notes",
  description: "Premium PKL internship daily note workspace",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}
    >
      <body className="app-root">{children}</body>
    </html>
  );
}
```

---

## 🗄 4. Database Setup & RLS Logic (`supabase_setup.sql`)

The database architecture is handled strictly through Supabase. Here is how custom `users` are tied to Supabase Auth and how the `is_admin()` check is structured.

### Admin Check Function
```sql
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where email_user = auth.uid()
      and role = true
  );
$$;
```

### Auto-User Creation Trigger
When a user signs up via Supabase Auth, they are inserted into the custom `public.users` table as a standard user (`role = false`).
```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (email_user, role, password)
  select new.id, false, 'managed-by-supabase-auth'
  where not exists (
    select 1
    from public.users
    where email_user = new.id
  );
  return new;
end;
$$;
```

### Row Level Security (RLS) Example
Users can only see/edit their own notes unless they are an admin.
```sql
drop policy if exists "pkl_notes_select_own_or_admin" on public.pkl_notes;
create policy "pkl_notes_select_own_or_admin"
on public.pkl_notes
for select
to authenticated
using (
  users_id in (
    select id from public.users where email_user = auth.uid()
  )
  or public.is_admin()
);
```

---

## 🔌 5. Supabase Client Configuration (`lib/supabase.js`)

Client-side initialization of Supabase with session persistence enabled.

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

---

## 🔐 6. Strict Middleware & Routing (`middleware.js`)

The Next.js `middleware.js` runs on the Edge to securely verify authentication and role access before rendering protected routes.

```javascript
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request) {
  const token = request.cookies.get("sb-access-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Setup non-persisting client for edge verification
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔴 Role protection for Admin
  if (request.nextUrl.pathname.startsWith("/admin-dashboard")) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("email_user", userData.user.id)
      .single();

    if (profileError || !profile?.role) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin-dashboard/:path*"],
};
```

---

## 🎨 7. UI/UX Design System (`globals.css`)

Vanilla CSS is strictly enforced. The styling relies on smooth glassmorphic panels and exact CSS token variables.

```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #121212;
  --border-color: rgba(255, 255, 255, 0.08);
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --accent-btn-bg: #ffffff;
  --accent-btn-text: #000000;
  --radius-lg: 28px;
  --radius-md: 18px;
  --shadow-soft: 0 24px 70px rgba(0, 0, 0, 0.5);
  --shadow-card: 0 12px 40px rgba(0, 0, 0, 0.4);
}

body {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body, "Plus Jakarta Sans", system-ui, sans-serif);
  line-height: 1.6;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.glass-panel {
  background: rgba(18, 18, 18, 0.9);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
```

## 🚨 8. Critical AI Developer Directives
If you are an AI modifying this codebase, you MUST adhere to the following:
1. **Understand The Stack:** Next.js + Tailwind CSS (Vanilla CSS Modules if needed) + GSAP.
2. **Follow The Middleware:** Do not implement client-side redirection as a replacement for `middleware.js`. The middleware is the absolute authority on access.
3. **Respect DB Triggers:** You do not need to manually create `public.users` on signup. Supabase `auth.users` insert trigger handles it.
4. **Design Aesthetic:** Use `var(--bg-secondary)` and `var(--border-color)`. Make things look clean, minimal, and expensive. Use glass panels.
