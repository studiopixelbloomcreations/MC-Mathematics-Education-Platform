# MC Mathematics

Premium EdTech platform for **MC Mathematics** by **Malinga C. Dissanayaka**.

## Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- Firebase Authentication only
- Supabase Database + Storage + Realtime
- Netlify deployment

## Routes

- `/landingpage` public website
- `/userdashboard` protected student dashboard
- `/adminpanel` private admin panel

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in Firebase + Supabase values.

3. In Supabase:

- Run [`supabase/schema.sql`](./supabase/schema.sql)
- Create storage buckets for `hall-of-fame` and `papers`
- Configure Supabase to trust Firebase JWTs so `auth.jwt()` contains the Firebase `sub`

4. In Firebase Authentication:

- Enable Google provider
- Keep Email/Password disabled if you want the current UI behavior to match production

5. Start the app:

```bash
npm run dev
```

## Architecture Notes

- Firebase is used **only** for authentication.
- Supabase stores **all** user, class, lesson, paper, announcement, and marks data.
- `users.user_id` is the Firebase UID.
- Student IDs are generated through the Supabase `generate_student_id` function.
- The UI includes fallback demo data so the app still renders before real credentials are added.
