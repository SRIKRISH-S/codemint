// ============================================================
// GET /api/session/[sessionId]
// Returns the current status of a checkout session.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';

// In a real app this would query a database.
// For local-first demo, session state lives in the client's
// localStorage, so this endpoint is used for polling from
// external callbacks (e.g., after Locus redirects back).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  // In production: query DB for session status
  // For mock: return a placeholder — client polls localStorage directly
  return NextResponse.json({
    sessionId,
    status: 'unknown',
    message: 'Check localStorage for session state in mock mode',
    mockMode: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  });
}
