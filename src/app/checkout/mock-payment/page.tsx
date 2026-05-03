'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Zap } from 'lucide-react';

/**
 * Mock Payment Page
 * This simulates the external Locus payment gateway.
 * In production, the user would be on Locus's domain.
 */
export default function MockPaymentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get('sessionId') ?? '';
  const orderId = params.get('orderId') ?? '';
  const amount = params.get('amount') ?? '999';

  const [step, setStep] = useState<'ready' | 'processing' | 'done'>('ready');

  async function confirmPayment() {
    setStep('processing');
    try {
      await fetch('/api/webhook/locus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locus-mock': 'true' },
        body: JSON.stringify({
          event: 'payment.success',
          sessionId,
          orderId,
          txHash: `0xmock_${Date.now().toString(16)}`,
          amount: parseInt(amount),
          currency: 'USD',
          timestamp: new Date().toISOString(),
        }),
      });
      setStep('done');
      setTimeout(() => router.push(`/results/${orderId}`), 1500);
    } catch {
      setStep('ready');
    }
  }

  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={36} color="#4ade80" />
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Payment Successful!</h1>
          <p style={{ color: '#a1a1b5' }}>Redirecting to your results…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{
        background: '#111118',
        border: '1px solid rgba(139,92,246,0.25)',
        borderRadius: '1.25rem',
        padding: '2.5rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 0 60px rgba(139,92,246,0.1)',
      }}>
        {/* Locus branding simulation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'linear-gradient(135deg, #6d28d9, #4c1d95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#fff" />
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>Locus Checkout</p>
            <p style={{ color: '#6b6b80', fontSize: '0.75rem' }}>Simulated Gateway · Demo Mode</p>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#a1a1b5', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Paying to</p>
          <p style={{ color: '#fff', fontWeight: 600, marginBottom: '1.25rem' }}>CodeMint AI</p>

          <div style={{ background: '#0a0a0f', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6b6b80', fontSize: '0.8125rem' }}>Amount</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>${(parseInt(amount) / 100).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b6b80', fontSize: '0.8125rem' }}>Network</span>
              <span style={{ color: '#a78bfa', fontSize: '0.8125rem' }}>Locus Chain</span>
            </div>
          </div>
        </div>

        <button
          onClick={confirmPayment}
          disabled={step === 'processing'}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            padding: '0.875rem',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {step === 'processing'
            ? <><Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite' }} /> Processing…</>
            : <><CheckCircle2 size={18} /> Confirm Payment</>
          }
        </button>

        <p style={{ textAlign: 'center', color: '#6b6b80', fontSize: '0.75rem', marginTop: '1rem' }}>
          🔒 This is a simulated Locus payment page for demo purposes
        </p>
      </div>
    </div>
  );
}
