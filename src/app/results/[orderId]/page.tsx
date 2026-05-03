'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2, AlertTriangle, AlertCircle, Info,
  ChevronDown, ChevronUp, Download, ArrowLeft, Loader2,
  Shield, Bug, Gauge, Code2, Star,
} from 'lucide-react';
import { Order, AnalysisFinding } from '@/lib/types';
import { getAllOrders } from '@/lib/store';

const SEVERITY_ICON: Record<string, React.ElementType> = {
  critical: AlertCircle,
  high:     AlertTriangle,
  medium:   AlertTriangle,
  low:      Info,
  info:     Info,
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#facc15' : score >= 40 ? '#fb923c' : '#f87171';
  const r = 40;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;

  return (
    <div style={{ position: 'relative', width: 100, height: 100 }}>
      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '1.375rem', fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>score</span>
      </div>
    </div>
  );
}

function FindingCard({ finding }: { finding: AnalysisFinding }) {
  const [open, setOpen] = useState(false);
  const Icon = SEVERITY_ICON[finding.severity] ?? Info;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          padding: '1rem 1.25rem',
          width: '100%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span className={`badge badge-${finding.severity}`}>
          <Icon size={11} />
          {finding.severity}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, color: '#f8f8fc', fontSize: '0.9375rem', marginBottom: '0.125rem' }}>
            {finding.title}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {finding.category}{finding.line ? ` · Line ${finding.line}` : ''}
          </p>
        </div>
        {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>

      {open && (
        <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, margin: '1rem 0' }}>
            {finding.description}
          </p>
          {finding.suggestion && (
            <div className="alert-info" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
              <strong>Fix: </strong>{finding.suggestion}
            </div>
          )}
          {finding.codeSnippet && (
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: '0.375rem', fontWeight: 600 }}>❌ Before</p>
              <div className="code-block">{finding.codeSnippet}</div>
            </div>
          )}
          {finding.fixedSnippet && (
            <div>
              <p style={{ fontSize: '0.75rem', color: '#4ade80', marginBottom: '0.375rem', fontWeight: 600 }}>✅ After</p>
              <div className="code-block">{finding.fixedSnippet}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [tab, setTab] = useState<'findings' | 'rewrite'>('findings');

  useEffect(() => {
    function load() {
      const orders = getAllOrders();
      const found = orders.find((o) => o.id === orderId);
      if (found) {
        setOrder(found);
        if (found.status === 'complete') {
          setLoading(false);
          setPolling(false);
        } else if (found.status === 'paid' || found.status === 'analyzing') {
          setPolling(true);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [orderId]);

  function downloadReport() {
    if (!order?.result) return;
    const result = order.result;
    const text = `# CodeMint AI Report
Order: ${order.id}
Date: ${new Date(order.createdAt).toLocaleString()}
Analysis: ${order.request.analysisType}
Score: ${result.score}/100

## Summary
${result.summary}

## Metrics
- Lines analyzed: ${result.metrics.linesAnalyzed}
- Issues found: ${result.metrics.issuesFound}
- Critical issues: ${result.metrics.criticalIssues}

## Findings
${result.findings.map((f) => `### [${f.severity.toUpperCase()}] ${f.title}
${f.description}
${f.suggestion ? `Fix: ${f.suggestion}` : ''}`).join('\n\n')}
`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codemint-report-${order.id.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Order not found.</p>
        <button className="btn-secondary" onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const result = order.result;

  if (polling || order.status === 'analyzing') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', border: '2px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={32} color="#a78bfa" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
        <h2 style={{ color: '#f8f8fc', fontSize: '1.25rem', fontWeight: 700 }}>Analyzing your code…</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Our AI is reviewing your submission. This takes about 5–10 seconds.</p>
      </div>
    );
  }

  if (order.status === 'awaiting-payment') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Payment not yet received for this order.</p>
        <button className="btn-primary" onClick={() => router.push('/checkout?orderId=' + orderId)}>
          Complete Payment
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2.5rem 0 5rem' }}>
      <div className="section-container" style={{ maxWidth: '900px' }}>
        {/* Back */}
        <button className="btn-ghost" onClick={() => router.push('/dashboard')} style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          {result && <ScoreRing score={result.score} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
              <span className="badge badge-paid">
                <CheckCircle2 size={11} />
                Paid
              </span>
              <span className={`badge badge-${order.request.analysisType === 'security' ? 'critical' : 'mock'}`}>
                {order.request.analysisType.replace('-', ' ').toUpperCase()}
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                {order.request.language}
              </span>
            </div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#f8f8fc', marginBottom: '0.5rem' }}>
              Analysis Report
            </h1>
            {result && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                {result.summary}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
            <button className="btn-secondary" onClick={downloadReport} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <Download size={15} />
              Download
            </button>
          </div>
        </div>

        {/* Metrics */}
        {result && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Lines Analyzed', value: result.metrics.linesAnalyzed, icon: Code2, color: '#60a5fa' },
              { label: 'Issues Found',   value: result.metrics.issuesFound,   icon: Bug,    color: '#fb923c' },
              { label: 'Critical',       value: result.metrics.criticalIssues, icon: Shield, color: '#f87171' },
              { label: 'Score',          value: `${result.score}/100`,          icon: Star,   color: '#4ade80' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                <Icon size={20} color={color} style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8f8fc', letterSpacing: '-0.03em' }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        {result?.rewrittenCode && (
          <div className="tab-bar" style={{ marginBottom: '1.25rem' }}>
            <button className={`tab-item ${tab === 'findings' ? 'active' : ''}`} onClick={() => setTab('findings')}>
              Findings ({result.findings.length})
            </button>
            <button className={`tab-item ${tab === 'rewrite' ? 'active' : ''}`} onClick={() => setTab('rewrite')}>
              Rewritten Code ✨
            </button>
          </div>
        )}

        {/* Findings */}
        {tab === 'findings' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {result.findings.length === 0 ? (
              <div className="alert-success" style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ fontWeight: 600, fontSize: '1.0625rem' }}>No issues found!</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.8 }}>Your code looks clean.</p>
              </div>
            ) : (
              result.findings.map((f) => <FindingCard key={f.id} finding={f} />)
            )}
          </div>
        )}

        {/* Rewrite */}
        {tab === 'rewrite' && result?.rewrittenCode && (
          <div>
            <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>AI-rewritten version with all issues resolved</p>
              <button
                className="btn-ghost"
                onClick={() => {
                  navigator.clipboard.writeText(result.rewrittenCode ?? '');
                }}
              >
                Copy
              </button>
            </div>
            <div className="code-block" style={{ maxHeight: '600px', overflow: 'auto' }}>
              {result.rewrittenCode}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
