// ============================================================
// POST /api/checkout/create
// Creates a Locus Checkout session and an Order in local storage.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createLocusCheckoutSession } from '@/lib/locus';
import { ANALYSIS_PRICING, AnalysisRequest, CheckoutSession, InputMethod, AnalysisType, Language } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputMethod, code, fileName, githubPrUrl, analysisType, language } = body as {
      inputMethod: InputMethod;
      code?: string;
      fileName?: string;
      githubPrUrl?: string;
      analysisType: AnalysisType;
      language: Language;
    };

    // Validate
    if (!analysisType || !ANALYSIS_PRICING[analysisType]) {
      return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    const pricing = ANALYSIS_PRICING[analysisType];
    const requestId = uuidv4();
    const sessionId = uuidv4();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    // Create Locus checkout session (mock or real)
    const locusSession = await createLocusCheckoutSession({
      amount: pricing.price,
      currency: 'USD',
      orderId: sessionId,
      description: `CodeMint AI — ${pricing.label}`,
      successUrl: `${appUrl}/results/${sessionId}`,
      cancelUrl:  `${appUrl}/analyze`,
      webhookUrl: `${appUrl}/api/webhook/locus`,
      metadata: { requestId, analysisType },
    });

    // Build objects to store client-side
    const request: AnalysisRequest = {
      id: requestId,
      inputMethod,
      code: code?.slice(0, 50000), // cap at 50k chars
      fileName,
      githubPrUrl,
      analysisType,
      language,
      createdAt: new Date().toISOString(),
    };

    const session: CheckoutSession = {
      id: sessionId,
      requestId,
      amount: pricing.price,
      currency: 'USD',
      status: 'pending',
      locusSessionId: locusSession.sessionId,
      locusPaymentUrl: locusSession.paymentUrl,
      walletAddress: locusSession.walletAddress,
      createdAt: new Date().toISOString(),
    };

    // Return to client — client stores in localStorage
    return NextResponse.json({
      orderId: sessionId,
      requestId,
      sessionId: locusSession.sessionId,
      paymentUrl: locusSession.paymentUrl,
      amount: pricing.price,
      request,
      session,
    });
  } catch (err: unknown) {
    console.error('[checkout/create]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
