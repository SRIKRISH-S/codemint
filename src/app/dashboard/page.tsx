'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Clock, CheckCircle2, AlertCircle,
  ChevronRight, Zap, TrendingUp, DollarSign, BarChart3,
} from 'lucide-react';
import { Order } from '@/lib/types';
import { getAllOrders, getAnalytics, clearAllOrders } from '@/lib/store';
import { seedLocalStorage } from '@/lib/seed';

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; icon: React.ElementType }> = {
  'pending':          { label: 'Pending',          badgeClass: 'badge-pending', icon: Clock },
  'awaiting-payment': { label: 'Awaiting Payment',  badgeClass: 'badge-pending', icon: Clock },
  'paid':             { label: 'Paid',              badgeClass: 'badge-paid',    icon: CheckCircle2 },
  'analyzing':        { label: 'Analyzing',         badgeClass: 'badge-info',    icon: Zap },
  'complete':         { label: 'Complete',          badgeClass: 'badge-paid',    icon: CheckCircle2 },
  'failed':           { label: 'Failed',            badgeClass: 'badge-failed',  icon: AlertCircle },
};

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8f8fc', letterSpacing: '-0.04em' }}>{value}</p>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '0.625rem', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order, highlight }: { order: Order; highlight?: boolean }) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG['pending'];
  const StatusIcon = cfg.icon;

  return (
    <div
      className="card"
      style={{
        padding: '1.125rem 1.375rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        border: highlight ? '1px solid rgba(139,92,246,0.5)' : undefined,
        background: highlight ? 'rgba(124,58,237,0.05)' : undefined,
        animation: highlight ? 'fadeInUp 0.5s ease both' : undefined,
      }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <p style={{ fontWeight: 600, color: '#f8f8fc', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
          {order.request.analysisType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {new Date(order.createdAt).toLocaleString()} · {order.request.inputMethod}
        </p>
      </div>

      <span className={`badge ${cfg.badgeClass}`}>
        <StatusIcon size={11} />
        {cfg.label}
      </span>

      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#a78bfa', minWidth: 60 }}>
        ${(order.session.amount / 100).toFixed(2)}
      </span>

      {order.status === 'complete' && (
        <Link href={`/results/${order.id}`} className="btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--border)' }}>
          View Report <ChevronRight size={13} />
        </Link>
      )}

      {order.status === 'awaiting-payment' && (
        <Link href={`/checkout?orderId=${order.id}`} className="btn-primary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}>
          Pay Now
        </Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const params = useSearchParams();
  const highlight = params.get('highlight') ?? '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<ReturnType<typeof getAnalytics> | null>(null);

  function reload() {
    seedLocalStorage();
    setOrders(getAllOrders());
    setAnalytics(getAnalytics());
  }

  useEffect(() => {
    reload();
    const interval = setInterval(reload, 3000);
    return () => clearInterval(interval);
  }, []);

  function handleReset() {
    clearAllOrders();
    reload();
  }

  const completed = orders.filter((o) => o.status === 'complete');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2.5rem 0 5rem' }}>
      <div className="section-container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8f8fc', letterSpacing: '-0.04em', marginBottom: '0.375rem' }}>
              <LayoutDashboard size={22} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: '#a78bfa' }} />
              Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Track your analysis sessions and results</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/analyze" className="btn-primary">
              <Zap size={15} />
              New Analysis
            </Link>
            <button
              className="btn-ghost"
              onClick={handleReset}
              style={{ border: '1px solid var(--border)', padding: '0.5rem 1rem' }}
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* Stats */}
        {analytics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard label="Total Revenue"    value={`$${(analytics.totalRevenue / 100).toFixed(2)}`} icon={DollarSign}  color="#4ade80" />
            <StatCard label="Total Orders"     value={String(analytics.totalOrders)}                   icon={BarChart3}   color="#60a5fa" />
            <StatCard label="Completed"        value={String(analytics.completedOrders)}               icon={CheckCircle2}color="#a78bfa" />
            <StatCard label="Conversion Rate"  value={`${analytics.conversionRate}%`}                  icon={TrendingUp}  color="#fb923c" />
          </div>
        )}

        {/* Orders */}
        <div>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8f8fc', marginBottom: '1rem' }}>
            All Orders
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
              ({orders.length} total)
            </span>
          </h2>
          {orders.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No orders yet. Start your first analysis!</p>
              <Link href="/analyze" className="btn-primary">Get Started</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} highlight={order.id === highlight || order.session.id === highlight} />
              ))}
            </div>
          )}
        </div>

        {/* Completed results */}
        {completed.length > 0 && (
          <div style={{ marginTop: '2.5rem' }}>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8f8fc', marginBottom: '1rem' }}>
              Completed Reports
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {completed.map((order) => {
                const result = order.result;
                if (!result) return null;
                const scoreColor = result.score >= 80 ? '#4ade80' : result.score >= 60 ? '#facc15' : '#f87171';
                return (
                  <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#c4b5fd' }}>
                        {order.request.analysisType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: scoreColor }}>{result.score}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {result.summary}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-critical">{result.metrics.criticalIssues} Critical</span>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        {result.metrics.issuesFound} Issues
                      </span>
                    </div>
                    <Link href={`/results/${order.id}`} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}>
                      View Full Report <ChevronRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
