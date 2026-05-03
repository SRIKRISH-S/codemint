'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExternalLink, Lock, CheckCircle2, Loader2, CreditCard, Zap, ArrowLeft } from 'lucide-react';
import { createOrder, updateOrderBySessionId, setOrderStatus, attachResult } from '@/lib/store';
import { generateMockAnalysis } from '@/lib/mock-analysis';
import { appendWebhookLog } from '@/lib/store';

export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();

  const paymentUrl = params.get('paymentUrl') ?? '';
  const orderId = params.get('orderId') ?? '';

  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [amountDisplay, setAmountDisplay] = useState('');
  const [typeDisplay, setTypeDisplay] = useState('');

  useEffect(() => {
    // Restore pending order from sessionStorage (set by analyze page)
    const pendingRaw = sessionStorage.getItem('codemint_checkout_payload');
    if (pendingRaw) {
      try {
        const { request, session } = JSON.parse(pendingRaw);
        createOrder(request, session);
        const price = (session.amount / 100).toFixed(2);
        setAmountDisplay(`$${price}`);
        setTypeDisplay(request.analysisType.replace(/-/g, ' '));
      } catch {/* ignore */}
    }

    // Redirect to real Locus if not a mock URL
    if (paymentUrl && !paymentUrl.includes('/checkout/mock-payment') && paymentUrl.startsWith('http')) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  async function handleMockPay() {
    setPaying(true);
    try {
      const payload = sessionStorage.getItem('codemint_checkout_payload');
      if (!payload) throw new Error('No pending order');
      const { request, session } = JSON.parse(payload);

      // 1. Call our webhook handler (simulates Locus posting to us)
      const webhookRes = await fetch('/api/webhook/locus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locus-mock': 'true' },
        body: JSON.stringify({
          event: 'payment.success',
          sessionId: session.id,
          orderId: session.id,
          txHash: `0xmock_${Date.now().toString(16)}`,
          amount: session.amount,
          currency: 'USD',
          timestamp: new Date().toISOString(),
        }),
      });

      const webhookData = await webhookRes.json();

      // 2. Write webhook log to localStorage
      appendWebhookLog({
        event: 'payment.success',
        payload: webhookData.logEntry?.payload ?? {},
        status: 'processed',
        sessionId: session.id,
      });

      // 3. Mark order as paid and analyzing
      updateOrderBySessionId(session.id, {
        status: 'paid',
        session: { ...session, status: 'paid', paidAt: new Date().toISOString() },
      });
      setOrderStatus(orderId || session.id, 'analyzing');

      setDone(true);
      sessionStorage.removeItem('codemint_checkout_payload');

      // 4. Run mock analysis
      const result = await generateMockAnalysis(
        session.id,
        request.id,
        request.analysisType,
        request.code ?? ''
      );

      // 5. Attach result and mark complete
      attachResult(orderId || session.id, result);

      // 6. Navigate to results
      router.push(`/results/${orderId || session.id}`);
    } catch (err) {
      console.error(err);
      setPaying(false);
      setDone(false);
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card animate-fade-in" style={{ padding: '3rem', textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={28} color="#4ade80" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8f8fc', marginBottom: '0.5rem' }}>Payment Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>AI analysis running… redirecting to results.</p>
          <div className="spinner" style={{ margin: '1.5rem auto 0' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card animate-fade-in" style={{ padding: '2.5rem', maxWidth: '460px', width: '100%' }}>
        {/* Back button */}
        <button className="btn-ghost" onClick={() => router.push('/analyze')} style={{ marginBottom: '1.5rem', padding: '0.375rem 0' }}>
          <ArrowLeft size={15} />
          Back to Analyze
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8f8fc' }}>Locus Checkout</h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Secure payment powered by Locus</p>
          </div>
          <span className="badge badge-mock" style={{ marginLeft: 'auto' }}>MOCK</span>
        </div>

        {/* Payment summary */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'capitalize' }}>
              {typeDisplay || 'AI Code Analysis'}
            </span>
            <span style={{ color: '#f8f8fc', fontWeight: 600, fontSize: '0.875rem' }}>{amountDisplay || '—'}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', margin: '0.75rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, color: '#f8f8fc' }}>Total due</span>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#a78bfa' }}>{amountDisplay || '—'}</span>
          </div>
        </div>

        {/* Mock wallet UI */}
        <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pay to wallet</p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: '#c4b5fd', wordBreak: 'break-all' }}>
            0xMOCK_WALLET_ADDRESS_DEMO_ONLY
          </p>
        </div>

        {/* Info bar */}
        <div className="alert-info" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <Zap size={15} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div style={{ fontSize: '0.8125rem' }}>
            <strong>Demo mode:</strong> Click "Complete Mock Payment" to simulate Locus payment, trigger AI analysis, and view results.
          </div>
        </div>

        {/* Actions */}
        <button
          className="btn-primary"
          style={{ width: '100%', marginBottom: '0.75rem' }}
          onClick={handleMockPay}
          disabled={paying}
        >
          {paying
            ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Processing…</>
            : <><CheckCircle2 size={16} /> Complete Mock Payment</>
          }
        </button>

        {paymentUrl && paymentUrl.startsWith('http') && !paymentUrl.includes('mock-payment') && (
          <a href={paymentUrl} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ExternalLink size={15} />
            Open Real Locus Checkout
          </a>
        )}

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
          <Lock size={12} />
          Secured by Locus · End-to-end encrypted
        </p>
      </div>
    </div>
  );
}
