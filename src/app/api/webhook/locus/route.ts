// ============================================================
// POST /api/webhook/locus
// Handles Locus payment webhook events.
// In mock mode, called directly by the mock payment page.
// In production, called by Locus servers.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { verifyLocusWebhook } from '@/lib/locus';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-locus-signature') ?? '';
  const isMock = req.headers.get('x-locus-mock') === 'true';

  // ── Signature Verification ──────────────────────────────
  if (!isMock) {
    const valid = verifyLocusWebhook(rawBody, signature);
    if (!valid) {
      console.warn('[webhook/locus] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  // ── Parse Payload ────────────────────────────────────────
  let payload: {
    event: string;
    sessionId: string;
    orderId?: string;
    txHash?: string;
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
    timestamp: string;
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log(`[webhook/locus] ${payload.event} — session: ${payload.sessionId}`);

  // ── Log entry (returned to client for localStorage write) ─
  const logEntry = {
    event: payload.event,
    payload: payload as Record<string, unknown>,
    status: 'processed' as const,
    sessionId: payload.sessionId,
  };

  // ── Handle Events ─────────────────────────────────────────
  switch (payload.event) {
    case 'payment.success': {
      /**
       * In production this is where you would:
       * 1. Mark the session as paid in your DB
       * 2. Trigger the AI analysis job
       * 3. Store the result in your DB
       *
       * In mock mode, the client handles state via localStorage.
       * We return the action needed so the client can act on it.
       */
      return NextResponse.json({
        ok: true,
        action: 'trigger_analysis',
        sessionId: payload.sessionId,
        orderId: payload.orderId,
        txHash: payload.txHash,
        logEntry,
      });
    }

    case 'payment.failed':
      return NextResponse.json({
        ok: true,
        action: 'mark_failed',
        sessionId: payload.sessionId,
        logEntry,
      });

    case 'payment.expired':
      return NextResponse.json({
        ok: true,
        action: 'mark_expired',
        sessionId: payload.sessionId,
        logEntry,
      });

    default:
      console.warn('[webhook/locus] Unknown event:', payload.event);
      return NextResponse.json({ ok: true, action: 'ignored', logEntry });
  }
}
