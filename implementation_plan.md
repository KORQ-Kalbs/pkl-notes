# 🚀 ULTIMATE IMPLEMENTATION PLAN: PKL Notes Full-Stack App

## 📌 Context
An AI assistant will read this file to automatically generate a production-ready Next.js web application called "PKL Notes". The app is for internship (PKL) daily note-taking and includes an Admin portal for reviewing these notes. 

The application has been explicitly designed to be built with Tailwind CSS, combined with vanilla CSS and GSAP for animations.

## 🛠 Tech Stack
- **Framework:** Next.js (App Router, JavaScript/JSX)
- **Database & Auth:** Supabase (PostgreSQL DB, Supabase Authentication)
- **Styling:** Tailwind CSS, combined with vanilla CSS and GSAP for animations.
- **Icons:** Lucide React (or SVG icons matching the minimalist aesthetic)

## 🗄 Database Schema (Supabase)

*Note: Supabase handles authentication natively in `auth.users`. We link our custom `users` table to this.*

### 1. `users` Table
This table stores application-specific user data and role definitions. Admins are manually set in the DB.
- `id` (int8) - Primary Key
- `created_at` (timestamptz) - Default `now()`
- `email_user` (uuid) - Foreign key referencing Supabase's built-in `auth.users.id`.
- `role` (bool) - Default `false`. Set manually to `true` in Supabase dashboard to grant Admin access.

### 2. `pkl_notes` Table
Stores the actual daily logs.
- `id` (int8) - Primary Key
- `users_id` (int8) - Foreign Key referencing our custom `users.id`.
- `created_at` (timestamptz) - Default `now()`
- `note_date` (date)
- `title` (text)
- `summary` (text)
- `activities` (text)
- `reflection` (text)
- `next_plan` (text)
- `location` (text)
- `status` (text) - **CRITICAL:** Default `'pending'`. Allowed values: `'pending'`, `'approved'`, `'flagged'`, `'hold'`. (Required for Admin Dashboard stats).
- `updated_at` (timestamptz) - Updated via DB trigger or API on edit.

## 🔐 Security & Row Level Security (RLS)
- **`users` Table:** Users can read their own row. Admins can read all.
- **`pkl_notes` Table:** 
  - Insert/Read: Users can manage rows where `users_id` equals their own `users.id`. 
  - Admin: Users with `role = true` can read all rows and update the `status` column.

## 📂 Exact Folder Structure
```text
/
├── app/
│   ├── layout.jsx           # Global HTML, body, and Theme variables
│   ├── page.jsx             # / Landing Page
│   ├── login/page.jsx       # /login
│   ├── register/page.jsx    # /register
│   ├── dashboard/           # Normal User Workspace
│   │   ├── page.jsx         # Notes list & submit form
│   │   └── layout.jsx       # User Sidebar
│   ├── admin-dashboard/     # Admin Portal (from mockup)
│   │   ├── page.jsx         # Stats, queue, and review actions
│   │   └── layout.jsx       # Admin Sidebar
│   └── globals.css          # Theme variables & resets
├── components/              # Reusable UI (Button, Input, Card, Badge)
├── lib/
│   └── supabase.js          # Supabase client initialization
└── middleware.js            # Route protection & role verification
```

## 🎨 UI/UX Design System (Vanilla CSS Variables)
To be defined in `app/globals.css`. Ensure smooth transitions on `background-color` and `color`.

### Dark Mode (Strict match to Admin Mockup)
- `--bg-primary`: `#0A0A0A` (Deep rich black)
- `--bg-secondary`: `#121212` (Cards/Sidebar)
- `--border-color`: `rgba(255,255,255,0.08)`
- `--text-primary`: `#FFFFFF`
- `--text-secondary`: `#A1A1AA` (Muted text for queue items)
- `--accent-btn-bg`: `#FFFFFF`
- `--accent-btn-text`: `#000000`

### Light Mode
- `--bg-primary`: `#F9FAFB`
- `--bg-secondary`: `#FFFFFF`
- `--border-color`: `#E5E7EB`
- `--text-primary`: `#111827`
- `--text-secondary`: `#6B7280`
- `--accent-btn-bg`: `#111827`
- `--accent-btn-text`: `#FFFFFF`

## 🚀 Page-by-Page AI Implementation Guide

### 1. `/` (Landing Page)
- **UI:** A breathtaking, premium hero section with smooth styling. Must feel expensive.
- **Content:** Title "PKL Notes", subtitle explaining the application.
- **Actions:** "Get Started" (routes to `/register`).

### 2. `/register` & `/login` (Authentication)
- **Integration:** Use `@supabase/supabase-js` auth methods (`signUp`, `signInWithPassword`).
- **Post-Registration Flow:** Upon successful signup via Supabase Auth, immediately insert a row into the custom `users` table using the returned `user.id` as the `email_user` (UUID).
- **Redirection:** On successful login, check the `users.role`. If `true`, route to `/admin-dashboard`. If `false`, route to `/dashboard`.

### 3. `/dashboard` (User View)
- **Middleware Check:** Must have an active Supabase session.
- **Fetch Logic:** Query `pkl_notes` where `users_id` matches the logged-in user.
- **UI:** 
  - A clean list of past submitted notes showing their `status` badges (e.g., Yellow for Pending, Green for Approved).
  - A beautiful form or modal to submit a new note covering all table fields.

### 4. `/admin-dashboard` (Admin View)
- **Middleware Check:** Verify session AND `role === true`. If false, kick to `/dashboard`.
- **UI Exact Match (Based on Mockup):**
  - **Sidebar:** Navigation links (Overview, Users, Notes, Approvals, Settings). Session indicator at the bottom ("Admin review mode").
  - **Stats Row:** 3 prominent cards calculating counts from `pkl_notes`: `Pending`, `Approved`, `Flagged`.
  - **Queue Section:** List of pending/flagged notes needing review. Show user name (fetch via JOIN with `users`), note title, and current status.
  - **Actions Section:** Panel on the right for "Review approvals" and "Manage users".
- **Functionality:** Admins click a queued note, read its contents, and update its `status` in the database.

## 🤖 AI Execution Directives
1. Set up Next.js strictly using `.jsx` and Vanilla CSS (`.module.css`). **DO NOT INSTALL TAILWIND.**
2. Configure Supabase client in `/lib/supabase.js`.
3. Create `globals.css` with the exact theme tokens provided above.
4. Build the Authentication flow first, ensuring the link between `auth.users` and the custom `users` table works flawlessly.
5. Create `middleware.js` to strictly enforce route boundaries based on authentication and the `role` boolean.
6. Build out the Dashboard and Admin Dashboard interfaces with extreme attention to aesthetic quality, spacing, and the provided color palettes.
