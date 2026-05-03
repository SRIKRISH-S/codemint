'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import {
  Zap, ShieldCheck, Bug, Gauge, Code2, ArrowRight,
  CheckCircle2, Star, Users, TrendingUp, Lock, CreditCard,
} from 'lucide-react';
import { seedLocalStorage } from '@/lib/seed';

const FEATURES = [
  {
    icon: Bug,
    title: 'Bug Detection',
    desc: 'Surface hidden logic errors, null dereferences, and async pitfalls before they reach production.',
    color: '#f87171',
  },
  {
    icon: ShieldCheck,
    title: 'Security Audit',
    desc: 'Identify SQL injections, XSS vectors, exposed secrets, and OWASP Top-10 vulnerabilities.',
    color: '#a78bfa',
  },
  {
    icon: Gauge,
    title: 'Optimization',
    desc: 'Reduce bundle size, eliminate redundant loops, and improve runtime performance.',
    color: '#34d399',
  },
  {
    icon: Code2,
    title: 'Full Rewrite',
    desc: 'Get a clean, typed, production-ready version of your code with all issues resolved.',
    color: '#60a5fa',
  },
];

const PRICING = [
  { type: 'Code Review',   price: '$4.99', desc: 'Best practices & readability', popular: false },
  { type: 'Bug Detection', price: '$6.99', desc: 'Deep logic & runtime analysis', popular: true  },
  { type: 'Security Audit',price: '$9.99', desc: 'Full vulnerability assessment', popular: false },
  { type: 'Full Rewrite',  price: '$14.99',desc: 'AI-rewritten production code',  popular: false },
];

const STATS = [
  { label: 'Code Reviews Done', value: '12,400+', icon: TrendingUp },
  { label: 'Bugs Found',        value: '38,000+', icon: Bug },
  { label: 'Happy Developers',  value: '2,800+',  icon: Users },
  { label: 'Avg. Score Boost',  value: '+34 pts', icon: Star },
];

export default function HomePage() {
  useEffect(() => {
    // Pre-load demo data for judges
    seedLocalStorage();
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-bg" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          {/* Live badge */}
          <div
            className="animate-fade-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              fontSize: '0.8125rem',
              color: '#c4b5fd',
              fontWeight: 500,
              marginBottom: '2rem',
            }}
          >
            <span className="pulse-dot" />
            Powered by Locus Checkout — instant, secure payments
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-delay"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              color: '#f8f8fc',
              marginBottom: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto 1.5rem',
            }}
          >
            AI Code Review that{' '}
            <span className="gradient-text">finds what you miss.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-delay2"
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}
          >
            Paste code, upload a file, or link a GitHub PR. Choose your analysis type,
            pay once with Locus Checkout, and receive a production-grade AI report in seconds.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/analyze" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              <Zap size={18} />
              Start Analyzing
              <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              View Demo Results
            </Link>
          </div>

          {/* Trust note */}
          <p style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <Lock size={12} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
            Payments secured by Locus Checkout &nbsp;·&nbsp; Mock mode enabled by default
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section style={{ padding: '3rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <Icon size={22} color="#7c3aed" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8f8fc', letterSpacing: '-0.03em' }}>
                  {value}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8f8fc', marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>
              Four ways to improve your code
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Choose the analysis that fits your need. Each is optimised for a specific goal.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '0.75rem',
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '1.0625rem', color: '#f8f8fc', marginBottom: '0.5rem' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8f8fc', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
              From code to report in 3 steps
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Submit your code', desc: 'Paste code, upload a file, or link a GitHub PR — any language.' },
              { step: '02', title: 'Pay with Locus',   desc: 'One-click checkout. Instant confirmation. Funds on-chain.' },
              { step: '03', title: 'Get your report',  desc: 'AI-generated findings with severity ratings, snippets, and fixes.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '4rem',
                    fontWeight: 900,
                    color: 'rgba(139,92,246,0.06)',
                    position: 'absolute',
                    top: '0.5rem',
                    right: '1rem',
                    lineHeight: 1,
                    letterSpacing: '-0.05em',
                    userSelect: 'none',
                  }}
                >
                  {step}
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '1rem',
                  }}
                >
                  {step}
                </div>
                <h3 style={{ fontWeight: 600, color: '#f8f8fc', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8f8fc', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
              Simple, per-report pricing
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Pay only when you need it. No subscriptions.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', maxWidth: '900px', margin: '0 auto' }}>
            {PRICING.map(({ type, price, desc, popular }) => (
              <div
                key={type}
                className={popular ? 'border-glow' : 'card'}
                style={{
                  padding: '1.75rem',
                  borderRadius: '1rem',
                  background: popular ? 'rgba(124,58,237,0.08)' : 'var(--bg-card)',
                  position: 'relative',
                }}
              >
                {popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      color: '#fff',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.75rem',
                      borderRadius: '9999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8f8fc', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
                  {price}
                </div>
                <div style={{ fontWeight: 600, color: '#c4b5fd', marginBottom: '0.375rem' }}>{type}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{desc}</div>
                <Link
                  href="/analyze"
                  className={popular ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section
        style={{
          margin: '0 1.5rem 4rem',
          borderRadius: '1.5rem',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(91,33,182,0.1) 100%)',
          border: '1px solid rgba(139,92,246,0.3)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#f8f8fc', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
          Ready to ship better code?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Join thousands of developers who trust CodeMint AI for production-ready code review.
        </p>
        <Link href="/analyze" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2.5rem' }}>
          <Zap size={18} />
          Analyze My Code Now
        </Link>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['No subscription required', 'Results in seconds', 'Locus-secured payments'].map((item) => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={14} color="#4ade80" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          © 2026 CodeMint AI · Built with Locus Checkout · Hackathon Demo
        </p>
      </footer>
    </div>
  );
}
