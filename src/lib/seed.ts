// ============================================================
// CodeMint AI — Seed / Demo Data
// Run this to pre-populate the local store for judges.
// ============================================================
import { v4 as uuidv4 } from 'uuid';
import { Order } from './types';

export function getSeedOrders(): Order[] {
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'seed-order-1',
      status: 'complete',
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(2.5),
      request: {
        id: 'seed-req-1',
        inputMethod: 'paste',
        code: 'const SECRET = "abc123";\nconst query = `SELECT * FROM users WHERE id = ${userId}`;',
        analysisType: 'security',
        language: 'javascript',
        createdAt: hoursAgo(3),
      },
      session: {
        id: 'seed-sess-1',
        requestId: 'seed-req-1',
        amount: 999,
        currency: 'USD',
        status: 'paid',
        locusSessionId: 'mock_sess_demo_1',
        txHash: '0xabc123def456demo1',
        createdAt: hoursAgo(3),
        paidAt: hoursAgo(2.8),
      },
      result: {
        id: 'seed-result-1',
        sessionId: 'seed-sess-1',
        requestId: 'seed-req-1',
        summary: 'Critical SQL injection and hardcoded secret vulnerabilities found. Immediate remediation is required before production deployment.',
        score: 41,
        findings: [
          {
            id: uuidv4(),
            severity: 'critical',
            category: 'Injection',
            title: 'SQL Injection Vulnerability',
            description: 'User input is directly concatenated into a SQL query without sanitization.',
            line: 2,
            suggestion: 'Use parameterized queries.',
            codeSnippet: 'const query = `SELECT * FROM users WHERE id = ${userId}`;',
            fixedSnippet: 'db.query("SELECT * FROM users WHERE id = ?", [userId]);',
          },
          {
            id: uuidv4(),
            severity: 'high',
            category: 'Authentication',
            title: 'Hardcoded Secret Key',
            description: 'Secret key is hardcoded in source code.',
            line: 1,
            suggestion: 'Use environment variables.',
            codeSnippet: 'const SECRET = "abc123";',
            fixedSnippet: 'const SECRET = process.env.SECRET_KEY;',
          },
        ],
        metrics: { linesAnalyzed: 2, issuesFound: 2, criticalIssues: 1, optimizationsFound: 0 },
        createdAt: hoursAgo(2.5),
      },
    },
    {
      id: 'seed-order-2',
      status: 'complete',
      createdAt: hoursAgo(1.5),
      updatedAt: hoursAgo(1),
      request: {
        id: 'seed-req-2',
        inputMethod: 'github-pr',
        githubPrUrl: 'https://github.com/example/repo/pull/42',
        analysisType: 'bug-detection',
        language: 'typescript',
        createdAt: hoursAgo(1.5),
      },
      session: {
        id: 'seed-sess-2',
        requestId: 'seed-req-2',
        amount: 699,
        currency: 'USD',
        status: 'paid',
        locusSessionId: 'mock_sess_demo_2',
        txHash: '0xdef789ghi012demo2',
        createdAt: hoursAgo(1.5),
        paidAt: hoursAgo(1.3),
      },
      result: {
        id: 'seed-result-2',
        sessionId: 'seed-sess-2',
        requestId: 'seed-req-2',
        summary: 'Three bugs found in the PR including an off-by-one error and unhandled async rejection.',
        score: 58,
        findings: [
          {
            id: uuidv4(),
            severity: 'high',
            category: 'Logic Error',
            title: 'Off-by-One in Loop Boundary',
            description: 'Loop iterates one index beyond array length.',
            line: 33,
            suggestion: 'Change `<= arr.length` to `< arr.length`.',
          },
          {
            id: uuidv4(),
            severity: 'high',
            category: 'Async',
            title: 'Unhandled Promise Rejection',
            description: 'Async function called without await or .catch().',
            line: 61,
            suggestion: 'Add .catch() handler.',
          },
        ],
        metrics: { linesAnalyzed: 87, issuesFound: 2, criticalIssues: 0, optimizationsFound: 0 },
        createdAt: hoursAgo(1),
      },
    },
    {
      id: 'seed-order-3',
      status: 'awaiting-payment',
      createdAt: hoursAgo(0.2),
      updatedAt: hoursAgo(0.2),
      request: {
        id: 'seed-req-3',
        inputMethod: 'paste',
        code: 'import _ from "lodash";\nconst result = arr.filter(x => x > 0).map(x => x * 2);',
        analysisType: 'optimization',
        language: 'javascript',
        createdAt: hoursAgo(0.2),
      },
      session: {
        id: 'seed-sess-3',
        requestId: 'seed-req-3',
        amount: 599,
        currency: 'USD',
        status: 'pending',
        locusSessionId: 'mock_sess_demo_3',
        createdAt: hoursAgo(0.2),
      },
    },
  ];
}

export function seedLocalStorage(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem('codemint_orders');
  if (existing) return; // don't overwrite existing data
  localStorage.setItem('codemint_orders', JSON.stringify(getSeedOrders()));
}
