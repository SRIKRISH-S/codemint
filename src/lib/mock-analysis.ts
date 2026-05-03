// ============================================================
// CodeMint AI — Mock Analysis Engine
// Generates realistic-looking AI results without OpenAI calls.
// ============================================================
import { v4 as uuidv4 } from 'uuid';
import { AnalysisFinding, AnalysisResult, AnalysisType } from './types';

// ---------------------------------------------------------------------------
// Canned findings per analysis type
// ---------------------------------------------------------------------------

const SECURITY_FINDINGS: AnalysisFinding[] = [
  {
    id: uuidv4(),
    severity: 'critical',
    category: 'Injection',
    title: 'SQL Injection Vulnerability',
    description: 'User input is directly concatenated into a SQL query without sanitization. An attacker could manipulate the query to access or destroy data.',
    line: 42,
    suggestion: 'Use parameterized queries or an ORM. Never concatenate raw user input.',
    codeSnippet: 'const query = `SELECT * FROM users WHERE id = ${userId}`;',
    fixedSnippet: 'const query = "SELECT * FROM users WHERE id = ?"; db.query(query, [userId]);',
  },
  {
    id: uuidv4(),
    severity: 'high',
    category: 'Authentication',
    title: 'Hardcoded Secret Key',
    description: 'A secret key or API token is hardcoded in the source file. Committing this to version control exposes it to anyone with repo access.',
    line: 7,
    suggestion: 'Move secrets to environment variables and load them via process.env.',
    codeSnippet: 'const SECRET_KEY = "super_secret_1234";',
    fixedSnippet: 'const SECRET_KEY = process.env.SECRET_KEY;',
  },
  {
    id: uuidv4(),
    severity: 'medium',
    category: 'XSS',
    title: 'Unescaped HTML Output',
    description: 'User-controlled data is rendered as raw HTML, creating a cross-site scripting vector.',
    line: 89,
    suggestion: 'Escape HTML entities before rendering. Use textContent instead of innerHTML.',
  },
];

const BUG_FINDINGS: AnalysisFinding[] = [
  {
    id: uuidv4(),
    severity: 'high',
    category: 'Logic Error',
    title: 'Off-by-One in Loop Boundary',
    description: 'Loop iterates one index beyond array length, causing an undefined access on the last iteration.',
    line: 33,
    suggestion: 'Change `<= arr.length` to `< arr.length`.',
    codeSnippet: 'for (let i = 0; i <= arr.length; i++)',
    fixedSnippet: 'for (let i = 0; i < arr.length; i++)',
  },
  {
    id: uuidv4(),
    severity: 'high',
    category: 'Async',
    title: 'Unhandled Promise Rejection',
    description: 'An async function is called without await or .catch(), silently swallowing errors.',
    line: 61,
    suggestion: 'Wrap in try/catch or add .catch() handler.',
    codeSnippet: 'fetchData(userId);',
    fixedSnippet: 'await fetchData(userId).catch(err => logger.error(err));',
  },
  {
    id: uuidv4(),
    severity: 'medium',
    category: 'Null Safety',
    title: 'Potential Null Dereference',
    description: 'Object may be null before property access, causing a runtime TypeError.',
    line: 77,
    suggestion: 'Add null check or use optional chaining (?.).',
    codeSnippet: 'const name = user.profile.name;',
    fixedSnippet: 'const name = user?.profile?.name ?? "Unknown";',
  },
];

const OPTIMIZATION_FINDINGS: AnalysisFinding[] = [
  {
    id: uuidv4(),
    severity: 'medium',
    category: 'Performance',
    title: 'Redundant Array Iteration',
    description: 'Array is filtered then mapped in two separate passes. A single reduce/flatMap halves the iterations.',
    line: 50,
    suggestion: 'Combine filter and map into a single reduce call.',
    codeSnippet: 'const result = arr.filter(x => x > 0).map(x => x * 2);',
    fixedSnippet: 'const result = arr.reduce((acc, x) => { if (x > 0) acc.push(x * 2); return acc; }, []);',
  },
  {
    id: uuidv4(),
    severity: 'low',
    category: 'Memory',
    title: 'Large Object Held in Closure',
    description: 'A large data object is captured in a closure and never released, causing a memory leak over time.',
    line: 22,
    suggestion: 'Extract only the needed fields before passing into the closure.',
  },
  {
    id: uuidv4(),
    severity: 'info',
    category: 'Bundle Size',
    title: 'Heavy Library Imported in Full',
    description: 'Entire lodash is imported when only `_.debounce` is used. This inflates bundle size by ~70 KB.',
    line: 1,
    suggestion: 'Use `import debounce from "lodash/debounce"` for tree-shaking.',
    codeSnippet: 'import _ from "lodash";',
    fixedSnippet: 'import debounce from "lodash/debounce";',
  },
];

const REVIEW_FINDINGS: AnalysisFinding[] = [
  {
    id: uuidv4(),
    severity: 'low',
    category: 'Naming',
    title: 'Non-Descriptive Variable Names',
    description: 'Variables like `x`, `tmp`, and `data` make intent unclear. Use domain-specific names.',
    suggestion: 'Replace single-letter or generic names with meaningful identifiers.',
  },
  {
    id: uuidv4(),
    severity: 'info',
    category: 'Documentation',
    title: 'Missing JSDoc Comments',
    description: 'Public functions lack documentation. Without JSDoc, editors cannot surface parameter hints.',
    suggestion: 'Add JSDoc to all exported functions, describing parameters, return types, and side effects.',
  },
  {
    id: uuidv4(),
    severity: 'medium',
    category: 'SOLID',
    title: 'God Function — Too Many Responsibilities',
    description: 'A single function handles validation, database writes, and email dispatch. This breaks the Single Responsibility Principle.',
    suggestion: 'Decompose into smaller, focused functions: validateInput(), saveToDb(), sendEmail().',
  },
];

const REWRITE_RESULT = `// ✨ CodeMint AI — Rewritten Code
// Improvements: type-safe, null-safe, optimized loops, 
//               descriptive naming, error handling added.

import type { User, UserProfile } from './types';

/**
 * Fetches a user profile by ID with full error handling.
 * @param userId - The unique user identifier
 * @returns Promise resolving to UserProfile or null if not found
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!userId || typeof userId !== 'string') {
    throw new Error('getUserProfile: userId must be a non-empty string');
  }

  try {
    const user = await db.users.findUnique({ where: { id: userId } });
    if (!user) return null;

    return {
      id: user.id,
      name: user?.profile?.name ?? 'Unknown',
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (error) {
    logger.error('Failed to fetch user profile', { userId, error });
    throw error;
  }
}

/**
 * Processes a list of positive numbers, doubling each value.
 * Uses a single-pass reduce instead of chained filter+map.
 */
export function processPositiveValues(values: number[]): number[] {
  return values.reduce<number[]>((acc, value) => {
    if (value > 0) acc.push(value * 2);
    return acc;
  }, []);
}
`;

// ---------------------------------------------------------------------------
// Mock generator
// ---------------------------------------------------------------------------

function findingsForType(type: AnalysisType): AnalysisFinding[] {
  const cloneWithNewIds = (arr: AnalysisFinding[]) =>
    arr.map((f) => ({ ...f, id: uuidv4() }));

  switch (type) {
    case 'security':
      return cloneWithNewIds(SECURITY_FINDINGS);
    case 'bug-detection':
      return cloneWithNewIds(BUG_FINDINGS);
    case 'optimization':
      return cloneWithNewIds(OPTIMIZATION_FINDINGS);
    case 'code-review':
      return cloneWithNewIds(REVIEW_FINDINGS);
    case 'full-rewrite':
      return cloneWithNewIds([...BUG_FINDINGS.slice(0, 2), ...REVIEW_FINDINGS.slice(0, 2)]);
  }
}

export async function generateMockAnalysis(
  sessionId: string,
  requestId: string,
  type: AnalysisType,
  code: string = ''
): Promise<AnalysisResult> {
  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 1800));

  const findings = findingsForType(type);
  const critical = findings.filter((f) => f.severity === 'critical').length;
  const linesAnalyzed = Math.max(code.split('\n').length, 20);

  const scoreMap: Record<AnalysisType, number> = {
    'code-review':   72,
    'bug-detection': 58,
    'optimization':  65,
    'security':      41,
    'full-rewrite':  88,
  };

  const summaryMap: Record<AnalysisType, string> = {
    'code-review':
      'The code follows reasonable conventions but has several readability and SOLID principle violations. Documentation is sparse and variable naming is inconsistent across modules.',
    'bug-detection':
      'Three significant bugs were detected including an off-by-one error, an unhandled async rejection, and a null dereference. These would cause runtime failures under production load.',
    'optimization':
      'Performance improvements are available through loop consolidation and selective library imports. Memory usage can be reduced by 30% with targeted fixes.',
    'security':
      'Critical SQL injection and hardcoded secret vulnerabilities found. Immediate remediation is required before production deployment.',
    'full-rewrite':
      'The rewritten version improves type safety, error handling, and readability. All identified bugs are resolved and the code is production-ready.',
  };

  return {
    id: uuidv4(),
    sessionId,
    requestId,
    summary: summaryMap[type],
    score: scoreMap[type],
    findings,
    rewrittenCode: type === 'full-rewrite' ? REWRITE_RESULT : undefined,
    metrics: {
      linesAnalyzed,
      issuesFound: findings.length,
      criticalIssues: critical,
      optimizationsFound: findings.filter((f) => f.category === 'Performance' || f.category === 'Memory').length,
    },
    createdAt: new Date().toISOString(),
  };
}
