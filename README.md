# CodeMint AI 🛡️

> **AI-powered code review, bug detection, security audits, and optimization — paid instantly with Locus Checkout.**

A polished, judge-ready hackathon demo showing a complete end-to-end flow:
1. User submits code → 2. Pays with Locus Checkout → 3. Gets AI-generated report

---

## ⚡ 30-Second Quick Start (Demo Mode)

```bash
# 1. Clone / navigate to the project
cd codemint

# 2. Install dependencies
npm install

# 3. Start the dev server (mock mode is default — no API keys needed)
npm run dev

# 4. Open your browser
open http://localhost:3000
```

**That's it.** The app runs in mock mode by default. No API keys required.

---

## 📁 Project Structure

```
codemint/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout + Navbar
│   │   ├── globals.css               # Design system (black/purple theme)
│   │   ├── analyze/page.tsx          # Code submission page
│   │   ├── checkout/
│   │   │   ├── page.tsx              # Locus Checkout wrapper
│   │   │   └── mock-payment/page.tsx # Simulated Locus gateway
│   │   ├── results/[orderId]/page.tsx# Analysis results viewer
│   │   ├── dashboard/page.tsx        # Orders + paid sessions
│   │   ├── admin/page.tsx            # Webhook logs + analytics
│   │   └── api/
│   │       ├── checkout/create/      # POST: create Locus session
│   │       ├── session/[id]/         # GET: session status
│   │       ├── webhook/locus/        # POST: webhook handler
│   │       └── analysis/store/       # POST: store results
│   ├── components/
│   │   └── Navbar.tsx
│   └── lib/
│       ├── types.ts                  # All TypeScript types
│       ├── store.ts                  # localStorage store (DB replacement)
│       ├── locus.ts                  # Locus Checkout integration
│       ├── mock-analysis.ts          # Mock AI analysis engine
│       └── seed.ts                   # Demo data for judges
├── .env.example                      # Environment variable template
├── .env.local                        # Local config (mock mode on)
└── README.md
```

---

## 🎬 Demo Script for Judges

Follow this script for a complete demo in under 3 minutes:

### Step 1 — Landing Page
- Open http://localhost:3000
- See the hero, pricing, and "How It Works" section

### Step 2 — Analyze Page
- Click **"Analyze Code"** in the navbar or hero CTA
- Click **"Load demo code"** (auto-populates with vulnerable JavaScript)
- Choose **Security Audit** as the analysis type
- Click **"Pay with Locus"** → $9.99

### Step 3 — Checkout (Locus Simulation)
- See the mock Locus Checkout UI with wallet address and amount
- Click **"Complete Mock Payment"**
- Watch the payment confirmation animation

### Step 4 — Results
- AI analysis runs automatically (~2 seconds)
- See the security score, critical findings, before/after code snippets
- Click any finding to expand and see the fix
- Click **"Download"** to export the report as Markdown

### Step 5 — Dashboard
- Click **"Dashboard"** in the navbar
- See revenue stats, order history, completed reports

### Step 6 — Admin
- Click **"Admin"** in the navbar
- See webhook logs from the payment just processed
- Switch to **Analytics** tab for revenue breakdown
- Switch to **Transactions** tab for full transaction history

---

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

| Variable | Description | Required for Mock? |
|---|---|---|
| `NEXT_PUBLIC_MOCK_MODE` | Set `true` for mock mode | ✅ Already set |
| `LOCUS_API_KEY` | Your Locus API key | ❌ Not needed in mock |
| `LOCUS_WALLET_ADDRESS` | Your Locus wallet | ❌ Not needed in mock |
| `LOCUS_WEBHOOK_SECRET` | Webhook signing secret | ❌ Not needed in mock |
| `OPENAI_API_KEY` | For real AI analysis | ❌ Not needed in mock |
| `GITHUB_TOKEN` | For GitHub PR fetching | ❌ Not needed in mock |

---

## 🔌 Switching to Real Locus Integration

1. Get your API key from [https://locus.finance/developers](https://locus.finance/developers)
2. Update `.env.local`:
   ```env
   NEXT_PUBLIC_MOCK_MODE=false
   LOCUS_API_KEY=your_real_key
   LOCUS_WALLET_ADDRESS=your_wallet
   LOCUS_WEBHOOK_SECRET=your_secret
   ```
3. Configure Locus to send webhooks to `https://your-domain.com/api/webhook/locus`
4. (Optional) Add `OPENAI_API_KEY` for real AI analysis instead of mock

Integration points are clearly marked with comments in:
- `src/lib/locus.ts` — checkout session creation
- `src/app/api/webhook/locus/route.ts` — payment event handling

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Custom CSS |
| Icons | Lucide React |
| State | localStorage (local-first) |
| Payment | Locus Checkout (mock + real) |
| AI | Mock engine (OpenAI placeholder) |
| ID generation | UUID v4 |

---

## 💾 Data Persistence

The app uses **localStorage** as a database replacement, making it fully local-first with zero infrastructure. This means:
- ✅ Works offline
- ✅ No database setup needed
- ✅ Data persists across page refreshes
- ✅ Seed data loads automatically on first visit

For production: replace `src/lib/store.ts` calls with your preferred database (PostgreSQL, Supabase, etc.).

---

## 🌟 Features

- ✅ **Landing page** with hero, pricing, stats, and CTA
- ✅ **Analyze page** — paste code, upload file, or paste GitHub PR URL
- ✅ **Locus Checkout** — mock payment simulation with realistic UI
- ✅ **AI Analysis** — mock engine with realistic findings for all analysis types
- ✅ **Results page** — score ring, expandable findings, before/after code, download
- ✅ **Dashboard** — order history, revenue stats, completed report cards
- ✅ **Admin panel** — webhook logs, analytics, transaction history
- ✅ **Seed data** — pre-loaded demo orders for judges
- ✅ **Export** — downloadable Markdown report
- ✅ **Responsive** — works on all screen sizes

---

## 📄 License

MIT — Built for the Locus Checkout Hackathon 2026
