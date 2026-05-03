// ============================================================
// POST /api/analysis/store
// Stores an analysis result (called from client after analysis)
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { AnalysisResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const result: AnalysisResult = await req.json();

    if (!result.id || !result.sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    /**
     * In production: save to database
     * For local-first demo: client writes to localStorage directly.
     * This endpoint serves as a placeholder for the production path.
     */
    console.log('[analysis/store] Storing result:', result.id, '— session:', result.sessionId);

    return NextResponse.json({ ok: true, resultId: result.id });
  } catch (err) {
    console.error('[analysis/store]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/analysis/store?sessionId=xxx — retrieve a result
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  /**
   * In production: query DB for result by sessionId
   * For local-first demo: client reads from localStorage directly.
   */
  return NextResponse.json({
    sessionId,
    message: 'In mock mode, results are stored in localStorage on the client.',
    mockMode: true,
  });
}
