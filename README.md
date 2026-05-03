# CodeMint AI 🛡️

> **The first per-report AI code review service powered by Locus Checkout. Get production-grade audits, bug fixes, and rewrites instantly with on-chain payments.**

CodeMint AI bridges the gap between high-end AI analysis and friction-less crypto payments. Built for the **Locus Checkout Hackathon 2026**, it demonstrates a complete end-to-end "Pay-per-Analysis" model with a premium, judge-ready UI.

---

## 🚀 Key Features

- 💎 **Four Core Analysis Modes**:
  - **Bug Detection**: Surface logic errors, null dereferences, and async pitfalls.
  - **Security Audit**: Identify SQL injections, XSS vectors, and OWASP Top-10 risks.
  - **Optimization**: Improve performance, reduce bundle size, and refactor loops.
  - **Full Rewrite**: Receive a complete, typed, production-ready version of your code.
- 🔗 **Locus Checkout Integration**: Secure, instant on-chain payments for every report.
- 📂 **Multi-Source Submission**: Paste code directly, upload files, or provide a GitHub Pull Request URL.
- 📊 **Interactive Reports**: Severity-rated findings, side-by-side code comparisons (Before/After), and downloadable Markdown exports.
- 🖥️ **Judge-Ready Admin Panel**: Live webhook logs, revenue analytics, and transaction history.
- 💾 **Local-First Architecture**: Uses `localStorage` as a DB replacement for a zero-setup, lightning-fast demo experience.

---

## ⚡ 30-Second Quick Start

The app runs in **Mock Mode** by default—no API keys or crypto wallet required to test the full flow.

```bash
# 1. Install Dependencies
npm install

# 2. Launch Development Server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** to start.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS v4 + Premium Dark Design System |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **State/DB** | Zustand + `localStorage` (Local-first persistence) |
| **Payment** | Locus Checkout (Simulator + Live API) |
| **AI Engine** | Mock Analysis Logic (Extensible to OpenAI/Claude) |

---

## 📁 Project Architecture

- `src/app/analyze`: The core submission engine with file dropzones and PR fetching.
- `src/app/checkout`: Wrapper for the Locus Checkout session and payment status.
- `src/app/results`: Dynamic report generation with interactive finding cards.
- `src/app/dashboard`: User history and revenue statistics.
- `src/app/admin`: Real-time webhook monitor and transaction debugger.
- `src/lib/store.ts`: The "Database" logic using persistent browser storage.
- `src/lib/seed.ts`: Automatically populates the app with demo data for immediate impact.

---

## 🎬 How to Demo for Judges

1. **Submit**: Go to the **Analyze** page and click "Load demo code".
2. **Pay**: Choose "Security Audit" ($9.99) and click **Pay with Locus**.
3. **Checkout**: On the mock gateway, click **Complete Payment**.
4. **Review**: Watch the analysis run and explore the findings, severity scores, and code fixes.
5. **Verify**: Visit the **Dashboard** to see the new order, and the **Admin** panel to see the incoming webhook payload.

---

## 🔧 Production Setup

To move from Mock Mode to Live:

1. Create a `.env.local` file (copy from `.env.example`).
2. Set `NEXT_PUBLIC_MOCK_MODE=false`.
3. Provide your `LOCUS_API_KEY` and `LOCUS_WALLET_ADDRESS` from [Locus Finance](https://locus.finance).
4. (Optional) Add an `OPENAI_API_KEY` for real-time AI inference.

---

## 📄 License

MIT — Created for the Locus Checkout Hackathon 2026.
