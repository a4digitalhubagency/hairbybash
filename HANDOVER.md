# HairbyBash — Client Handover Guide

**Prepared for:** Bash (HairbyBash)
**Prepared by:** Development Team
**Date:** March 2026

---

## What Was Built

A fully custom professional website for HairbyBash — a private braiding and natural hair studio based in Calgary, AB. The site handles everything from first impression to paid booking, with a private admin panel for Bash to manage her business day-to-day.

---

## Pages & What They Do

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page — hero, services preview, about teaser |
| Services | `/services` | Full service menu with pricing |
| About | `/about` | Bash's story, journey, and studio info |
| Contact | `/contact` | WhatsApp, email, and Instagram contact channels |
| Book | `/book` | Multi-step booking flow with Stripe payment |
| FAQ | `/faq` | Policies and frequently asked questions |
| Admin | `/admin` | Private dashboard — bookings, services, calendar |

---

## Tech Stack (Plain English)

| Tool | What it does |
|------|-------------|
| **Next.js 16** | The website framework — runs the whole site |
| **Supabase** | The database — stores bookings, services, blocked dates |
| **Stripe** | Handles all payments securely |
| **Resend** | Sends automated emails to clients and Bash |
| **Vercel** | Hosts the live website |
| **Tailwind CSS** | Styles and layout |
| **Framer Motion** | Smooth animations throughout the site |

---

## How Bookings Work (End-to-End)

1. Client picks a service on `/book`
2. Client picks an available date and time
3. Client enters their name, email, and notes
4. Client pays a deposit via Stripe (secure checkout)
5. **On payment success:**
   - Booking is saved to database as `confirmed`
   - Client receives a confirmation email automatically
   - Bash receives a "New Booking" alert email automatically
6. If the client abandons the payment page, the slot is released and a "slot released" email is sent to the client

---

## Admin Dashboard (`/admin`)

Bash logs in at `yourdomain.com/admin` with her email and password.

### Dashboard
- Live stats: total revenue, total clients, pending bookings, today's appointments
- Full bookings table — filter by status (pending / confirmed / cancelled)
- Confirm or cancel any booking — client is emailed automatically on status change

### Calendar
- Month view of all confirmed bookings
- Quick visual of busy vs. available days

### Services
- Add, edit, or delete services
- Set name, category, price, duration, and description
- Changes appear on the public `/services` page and in the booking flow immediately

### Blocking Dates
- Block specific days (holidays, personal time off, travel)
- Blocked dates are hidden from the booking calendar — clients cannot book them

---

## Automated Emails (4 Templates)

All emails are sent automatically — no manual action needed.

| Email | Sent to | When |
|-------|---------|------|
| **Booking Confirmed** | Client | Immediately after successful payment |
| **New Booking Alert** | Bash | Same moment as above |
| **Status Update** | Client | When Bash confirms or cancels from dashboard |
| **Slot Released** | Client | When Stripe checkout session expires (30 min) |

---

## Before Going Live — Checklist

### Step 1 — Supabase
- [ ] Go to [supabase.com](https://supabase.com) → your project → **Settings → API**
- [ ] Copy `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Add all three to Vercel (Settings → Environment Variables)
- [ ] Create Bash's admin account: **Authentication → Users → Add user** (use her email + a strong password)

### Step 2 — Stripe
- [ ] Switch Stripe to **Live mode** (toggle in top-left of Stripe dashboard)
- [ ] Copy the live `STRIPE_SECRET_KEY` → add to Vercel
- [ ] Go to **Stripe → Developers → Webhooks → Add endpoint**
  - URL: `https://yourdomain.com/api/stripe/webhook`
  - Events to listen for: `checkout.session.completed`, `checkout.session.expired`
  - Copy the webhook signing secret → add as `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Set `NEXT_PUBLIC_APP_URL` in Vercel to `https://yourdomain.com`

### Step 3 — Email (Resend)
- [ ] Sign up at [resend.com](https://resend.com) → create an API key
- [ ] Add your sending domain (e.g. `hairbybash.ca`) and verify DNS records (takes up to 48h)
- [ ] Add these to Vercel:
  - `RESEND_API_KEY` — from Resend dashboard
  - `RESEND_FROM_EMAIL` — e.g. `HairbyBash <bookings@hairbybash.ca>`
  - `RESEND_ADMIN_EMAIL` — `hairbybash01@gmail.com`

### Step 4 — Deploy
- [ ] Merge the dev branch to `main` on GitHub
- [ ] Vercel auto-deploys — check the deployment logs for any errors
- [ ] Visit the live URL, place a test booking (Stripe test mode first, then flip to live)
- [ ] Confirm Bash receives the "New Booking" email
- [ ] Confirm the client receives the confirmation email

---

## Logins & Access (Keep These Safe)

| Service | Who manages it | Access |
|---------|---------------|--------|
| Vercel | Developer | Hosts the website |
| Supabase | Developer | Database |
| Stripe | Bash / Developer | Payments |
| Resend | Developer | Email sending |
| GitHub | Developer | Source code |
| Admin panel (`/admin`) | Bash | Bookings, services, calendar |

> **Important:** Never share the admin password. If you forget it, the developer can reset it directly in Supabase → Authentication → Users.

---

## How to Update Services

1. Log into `/admin` with your credentials
2. Click **Services** in the left sidebar
3. Click **Add Service** to create a new one, or click the edit icon next to any existing service
4. Fill in: name, category (Braids / Locs / Treatments / Kids), price, duration, and description
5. Save — it appears on the public services page and booking flow **immediately**

> **Categories available:** Braids, Locs, Natural Hair Treatments, Kids

---

## How to Block Time Off

1. Log into `/admin`
2. Go to **Dashboard** → scroll to the **Blocked Dates** section
3. Pick a date and click Block — clients will not be able to book that day
4. To unblock, click the X next to the date

---

## Domain & Hosting

- The site is hosted on **Vercel** — free tier works for this scale
- Connect a custom domain (e.g. `hairbybash.ca`) in Vercel → Settings → Domains
- Vercel gives you free SSL (the padlock in the browser) automatically

---

## Digital Growth — Next Steps

These are the recommended next actions to grow HairbyBash's online presence after launch.

### Short Term (Month 1–2)

**1. Google Business Profile**
- Create or claim: [business.google.com](https://business.google.com)
- Add photos, hours, service area (Calgary, AB), and the website URL
- This gets HairbyBash showing up on Google Maps and local search results
- Ask happy clients to leave Google reviews — this is the #1 driver of local discovery

**2. Instagram Consistency**
- Post finished looks consistently (3–5x/week Reels perform best)
- Use location tags: Calgary, AB + neighbourhood tags
- Add the booking link (`yoursite.com/book`) to bio
- Use hashtags: #CalgaryBraids #CalgaryHair #HairbyBash #ProtectiveStyles #NaturalHair

**3. Pinterest for Discovery**
- Hair content performs extremely well on Pinterest
- Pin every finished look — it drives long-term organic traffic
- Link each pin back to the website

### Medium Term (Month 3–6)

**4. Loyalty Programme**
- A simple referral card: "Refer a friend, get $10 off your next visit"
- Can be tracked manually or added to the admin dashboard later

**5. Google Ads (Local)**
- Target: "braids Calgary", "box braids Calgary", "protective styles Calgary"
- Small budget ($5–10/day) converts well for service businesses
- Only start once the booking flow is fully live and tested

**6. Before & After Content Strategy**
- Short Reels showing the transformation — start to finish in 30 seconds
- These consistently go viral in the hair niche and drive DM inquiries

**7. TikTok**
- Expand Instagram Reels content to TikTok — younger demographic, huge reach for hair
- Behind-the-scenes studio content performs very well

### Long Term (6+ Months)

**8. Add Online Deposits Only (Already Supported)**
- Current build supports full or partial payment — can configure Stripe to collect a deposit and collect the rest in-person

**9. Gift Cards**
- Stripe supports gift card flows — can be added as a future feature

**10. SEO Blog**
- A simple blog with articles like "Best Protective Styles for Winter in Calgary" drives long-term Google traffic
- Can be added as a `/blog` route using Supabase as CMS

**11. Email List**
- Collect emails at checkout (already captured in bookings)
- Use Resend to send monthly newsletters with available slots, new services, or promotions

---

## Known Limitations & Future Improvements

| Item | Notes |
|------|-------|
| Kids category in admin | Currently not a selectable category when adding a new service — needs a one-line code fix |
| Services-to-booking sync | If a service is added without refreshing the booking page cache, it may not appear immediately — fixed by clearing Next.js cache on deploy |
| Responsiveness | Core pages are responsive; some admin views are best on desktop |
| No SMS notifications | Email only — WhatsApp/SMS can be added via Twilio in a future phase |
| No review collection | Google review prompt after appointment can be added as an email follow-up |

---

## Contact the Developer

For bugs, new features, or questions — reach out to the developer who built this project. Keep this document and all credentials stored securely (e.g. a password manager like 1Password or Bitwarden).

---

*Built with care for HairbyBash — Calgary's premier braiding studio.*
