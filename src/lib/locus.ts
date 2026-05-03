// ============================================================
// CodeMint AI — Locus Checkout Integration
// When MOCK_MODE=true, this module simulates Locus responses.
// When MOCK_MODE=false, real Locus API calls are made.
// ============================================================

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

export interface LocusSessionPayload {
  amount: number;       // in USD cents
  currency: string;
  orderId: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
  metadata?: Record<string, string>;
}

export interface LocusSessionResponse {
  sessionId: string;
  paymentUrl: string;
  walletAddress: string;
  expiresAt: string;
  status: 'pending';
}

export interface LocusWebhookPayload {
  event: 'payment.success' | 'payment.failed' | 'payment.expired';
  sessionId: string;
  txHash?: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  timestamp: string;
}

// ---- Mock Implementation -----------------------------------

async function mockCreateSession(payload: LocusSessionPayload): Promise<LocusSessionResponse> {
  const sessionId = `mock_sess_${Date.now()}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return {
    sessionId,
    // In mock mode we redirect directly to our own mock payment page
    paymentUrl: `${appUrl}/checkout/mock-payment?sessionId=${sessionId}&orderId=${payload.orderId}&amount=${payload.amount}`,
    walletAddress: '0xMOCK_WALLET_ADDRESS_DEMO_ONLY',
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    status: 'pending',
  };
}

// ---- Real Implementation -----------------------------------

async function realCreateSession(payload: LocusSessionPayload): Promise<LocusSessionResponse> {
  /**
   * REAL LOCUS INTEGRATION POINT
   * ─────────────────────────────────────────────────────────
   * Docs: https://docs.locus.finance/checkout/create-session
   *
   * Replace this block with the actual Locus API call once
   * you have your API key and wallet configured.
   */
  const LOCUS_API_URL = process.env.LOCUS_API_URL ?? 'https://api.locus.finance/v1';
  const LOCUS_API_KEY = process.env.LOCUS_API_KEY;

  if (!LOCUS_API_KEY) {
    throw new Error('LOCUS_API_KEY is not set. Set NEXT_PUBLIC_MOCK_MODE=true to use mock mode.');
  }

  const res = await fetch(`${LOCUS_API_URL}/checkout/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LOCUS_API_KEY}`,
    },
    body: JSON.stringify({
      amount: payload.amount,
      currency: payload.currency,
      order_id: payload.orderId,
      description: payload.description,
      success_url: payload.successUrl,
      cancel_url: payload.cancelUrl,
      webhook_url: payload.webhookUrl,
      wallet_address: process.env.LOCUS_WALLET_ADDRESS,
      metadata: payload.metadata,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Locus API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    sessionId: data.id,
    paymentUrl: data.payment_url,
    walletAddress: data.wallet_address,
    expiresAt: data.expires_at,
    status: 'pending',
  };
}

// ---- Public API -------------------------------------------

export async function createLocusCheckoutSession(
  payload: LocusSessionPayload
): Promise<LocusSessionResponse> {
  if (MOCK_MODE) {
    return mockCreateSession(payload);
  }
  return realCreateSession(payload);
}

/**
 * Verify a Locus webhook signature.
 * In mock mode, always returns true.
 */
export function verifyLocusWebhook(
  rawBody: string,
  signature: string
): boolean {
  if (MOCK_MODE) return true;

  /**
   * REAL LOCUS WEBHOOK VERIFICATION POINT
   * ─────────────────────────────────────────────────────────
   * Use HMAC-SHA256 to verify the signature:
   *
   * const crypto = require('crypto');
   * const expected = crypto
   *   .createHmac('sha256', process.env.LOCUS_WEBHOOK_SECRET!)
   *   .update(rawBody)
   *   .digest('hex');
   * return `sha256=${expected}` === signature;
   */
  console.warn('Locus webhook verification not implemented for production mode.');
  return true;
}
