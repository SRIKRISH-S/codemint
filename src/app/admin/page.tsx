'use client';

import { useEffect, useState } from 'react';
import {
  Settings, Activity, Webhook, BarChart3,
  RefreshCw, CheckCircle2, AlertCircle, Clock,
  DollarSign, TrendingUp, Users, Zap,
} from 'lucide-react';
import { getAllWebhookLogs, getAnalytics, getAllOrders, clearAllWebhookLogs } from '@/lib/store';
import { WebhookLog } from '@/lib/types';
import { seedLocalStorage } from '@/lib/seed';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  received:  { label: 'Received',  color: '#60a5fa', icon: Clock },
  processed: { label: 'Processed', color: '#4ade80', icon: CheckCircle2 },
  failed:    { label: 'Failed',    color: '#f87171', icon: AlertCircle },
};

function WebhookLogRow({ log }: { log: WebhookLog }) {
  const cfg = STATUS_CONFIG[log.status] ?? STATUS_CONFIG.received;
  const Icon = cfg.icon;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr 120px 160px',
        gap: '0.75rem',
        alignItems: 'center',
        padding: '0.875rem 1.25rem',
        borderBottom: '1px solid var(--border)',
        fontSize: '0.8125rem',
      }}
    >
      <span style={{ color: cfg.color, display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600 }}>
        <Icon size={13} /> {cfg.label}
      </span>
      <span style={{ color: '#c4b5fd', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {log.event}
      </span>
      <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {log.sessionId?.slice(0, 16) ?? '—'}
      </span>
      <span style={{ color: 'var(--text-muted)' }}>
        {new Date(log.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
}

export default function AdminPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [analytics, setAnalytics] = useState<ReturnType<typeof getAnalytics> | null>(null);
  const [tab, setTab] = useState<'logs' | 'analytics' | 'transactions'>('analytics');

  function reload() {
    seedLocalStorage();
    setLogs(getAllWebhookLogs());
    setAnalytics(getAnalytics());
  }

  useEffect(() => {
    reload();
    const interval = setInterval(reload, 3000);
    return () => clearInterval(interval);
  }, []);

  function handleClearLogs() {
    clearAllWebhookLogs();
    reload();
  }

  const orders = getAllOrders();
  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE !== 'false';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2.5rem 0 5rem' }}>
      <div className="section-container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8f8fc', letterSpacing: '-0.04em', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Settings size={22} color="#a78bfa" />
              Admin Panel
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Webhook logs, analytics, and transaction history</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className={`badge ${isMock ? 'badge-mock' : 'badge-paid'}`}>
              <span className="pulse-dot" style={{ background: isMock ? '#a78bfa' : '#4ade80' }} />
              {isMock ? 'Mock Mode' : 'Live Mode'}
            </span>
            <button className="btn-ghost" onClick={reload} style={{ border: '1px solid var(--border)' }}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Environment info */}
        <div
          style={{
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '0.875rem',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            fontSize: '0.8125rem',
          }}
        >
          {[
            { label: 'Mode', value: isMock ? 'Mock (Demo)' : 'Production', color: isMock ? '#a78bfa' : '#4ade80' },
            { label: 'Locus API URL', value: process.env.LOCUS_API_URL ?? 'Not set', color: 'var(--text-secondary)' },
            { label: 'Wallet', value: isMock ? '0xMOCK…' : (process.env.LOCUS_WALLET_ADDRESS ?? 'Not set'), color: 'var(--text-secondary)' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
              <span style={{ color, fontWeight: 600, fontFamily: 'monospace' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-bar" style={{ marginBottom: '1.5rem' }}>
          {[
            { id: 'analytics',    label: 'Analytics',    icon: BarChart3 },
            { id: 'transactions', label: 'Transactions',  icon: Activity  },
            { id: 'logs',         label: 'Webhook Logs',  icon: Webhook   },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`tab-item ${tab === id ? 'active' : ''}`}
              onClick={() => setTab(id as typeof tab)}
            >
              <Icon size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
              {label}
            </button>
          ))}
        </div>

        {/* Analytics tab */}
        {tab === 'analytics' && analytics && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Revenue',    value: `$${(analytics.totalRevenue / 100).toFixed(2)}`,   icon: DollarSign,  color: '#4ade80' },
                { label: 'Total Orders',     value: String(analytics.totalOrders),                       icon: BarChart3,   color: '#60a5fa' },
                { label: 'Completed',        value: String(analytics.completedOrders),                   icon: CheckCircle2,color: '#a78bfa' },
                { label: 'Conversion Rate',  value: `${analytics.conversionRate}%`,                      icon: TrendingUp,  color: '#fb923c' },
                { label: 'Avg Order Value',  value: `$${(analytics.avgOrderValue / 100).toFixed(2)}`,   icon: Users,       color: '#facc15' },
                { label: 'Pending',          value: String(analytics.pendingOrders),                     icon: Clock,       color: '#6b6b80' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                      <p style={{ fontSize: '1.625rem', fontWeight: 800, color: '#f8f8fc', letterSpacing: '-0.04em' }}>{value}</p>
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue by analysis type */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#f8f8fc', marginBottom: '1.25rem' }}>Revenue by Analysis Type</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(analytics.revenueByType).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No completed orders yet.</p>
                ) : (
                  Object.entries(analytics.revenueByType).map(([type, rev]) => {
                    const max = Math.max(...Object.values(analytics.revenueByType));
                    const pct = max > 0 ? (rev / max) * 100 : 0;
                    return (
                      <div key={type}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.875rem' }}>
                          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{type.replace(/-/g, ' ')}</span>
                          <span style={{ color: '#4ade80', fontWeight: 700 }}>${(rev / 100).toFixed(2)}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transactions tab */}
        {tab === 'transactions' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700, color: '#f8f8fc' }}>Transaction History</h3>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{orders.length} entries</span>
            </div>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 130px 130px', gap: '0.75rem', padding: '0.625rem 1.25rem', background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Order ID</span><span>Type</span><span>Amount</span><span>Status</span><span>Date</span>
            </div>
            {orders.length === 0 ? (
              <p style={{ padding: '2rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No transactions yet.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 130px 130px', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', fontSize: '0.8125rem', alignItems: 'center' }}
                >
                  <span style={{ fontFamily: 'monospace', color: '#c4b5fd', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.id.slice(0, 24)}…</span>
                  <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{order.request.analysisType.replace(/-/g, ' ')}</span>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>${(order.session.amount / 100).toFixed(2)}</span>
                  <span className={`badge badge-${order.status === 'complete' ? 'paid' : order.status === 'failed' ? 'failed' : 'pending'}`}>
                    {order.status}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Webhook Logs tab */}
        {tab === 'logs' && (
          <div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700, color: '#f8f8fc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={16} color="#a78bfa" />
                  Incoming Webhooks
                </h3>
                <button className="btn-ghost" onClick={handleClearLogs} style={{ fontSize: '0.8125rem' }}>
                  Clear All
                </button>
              </div>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 120px 160px', gap: '0.75rem', padding: '0.625rem 1.25rem', background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>Status</span><span>Event</span><span>Session ID</span><span>Time</span>
              </div>
              {logs.length === 0 ? (
                <p style={{ padding: '2rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No webhook events yet. Complete a mock payment to see logs here.
                </p>
              ) : (
                logs.map((log) => <WebhookLogRow key={log.id} log={log} />)
              )}
            </div>

            {/* Webhook Integration Guide */}
            <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#f8f8fc', marginBottom: '1rem' }}>🔗 Locus Webhook Integration</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.7 }}>
                Configure Locus to POST webhook events to your app. In production, point Locus to:
              </p>
              <div className="code-block" style={{ marginBottom: '1rem', fontSize: '0.8125rem' }}>
                POST https://your-domain.com/api/webhook/locus
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                The webhook handler verifies the <code style={{ color: '#c4b5fd' }}>LOCUS_WEBHOOK_SECRET</code>, updates the order status, triggers AI analysis, and stores results.
                In mock mode, events are sent directly from the browser.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
