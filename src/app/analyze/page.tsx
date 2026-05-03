'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code2, Upload, GitPullRequest, ChevronRight,
  X, FileText, AlertCircle, Loader2,
} from 'lucide-react';
import { AnalysisType, InputMethod, Language, ANALYSIS_PRICING } from '@/lib/types';

const INPUT_TABS: { id: InputMethod; label: string; icon: React.ElementType }[] = [
  { id: 'paste',     label: 'Paste Code',   icon: Code2 },
  { id: 'file',      label: 'Upload File',  icon: Upload },
  { id: 'github-pr', label: 'GitHub PR',    icon: GitPullRequest },
];

const ANALYSIS_TYPES: AnalysisType[] = [
  'code-review', 'bug-detection', 'optimization', 'security', 'full-rewrite',
];

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'auto',       label: 'Auto-detect'  },
  { id: 'javascript', label: 'JavaScript'   },
  { id: 'typescript', label: 'TypeScript'   },
  { id: 'python',     label: 'Python'       },
  { id: 'rust',       label: 'Rust'         },
  { id: 'go',         label: 'Go'           },
  { id: 'java',       label: 'Java'         },
  { id: 'cpp',        label: 'C++'          },
];

const DEMO_CODE = `import _ from "lodash";
const SECRET_KEY = "super_secret_1234";

async function getUser(userId) {
  const query = \`SELECT * FROM users WHERE id = \${userId}\`;
  const result = await db.query(query);
  const name = result.profile.name;
  
  const positives = arr.filter(x => x > 0).map(x => x * 2);
  
  for (let i = 0; i <= positives.length; i++) {
    fetchData(positives[i]);  // unhandled promise
  }
  return name;
}`;

export default function AnalyzePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [inputMethod, setInputMethod] = useState<InputMethod>('paste');
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [githubPrUrl, setGithubPrUrl] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('bug-detection');
  const [language, setLanguage] = useState<Language>('auto');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pricing = ANALYSIS_PRICING[analysisType];

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    readFile(file);
  }

  function readFile(file: File) {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setCode(e.target?.result as string);
    reader.readAsText(file);
  }

  function loadDemo() {
    setCode(DEMO_CODE);
    setLanguage('javascript');
  }

  async function handleSubmit() {
    setError('');

    // Validation
    if (inputMethod === 'paste' && !code.trim()) {
      setError('Please paste some code to analyze.');
      return;
    }
    if (inputMethod === 'file' && !code.trim()) {
      setError('Please upload a file.');
      return;
    }
    if (inputMethod === 'github-pr' && !githubPrUrl.trim()) {
      setError('Please enter a GitHub PR URL.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputMethod, code, fileName, githubPrUrl, analysisType, language }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const data = await res.json();
      const { orderId, paymentUrl, request, session } = data;

      // Store the full payload for the checkout page to create the order
      sessionStorage.setItem('codemint_checkout_payload', JSON.stringify({ request, session }));

      // Navigate to our checkout page (which wraps Locus or mock)
      router.push(`/checkout?paymentUrl=${encodeURIComponent(paymentUrl)}&orderId=${orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '3rem 0 5rem' }}>
      <div className="section-container" style={{ maxWidth: '860px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8f8fc', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
            Analyze Your Code
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Submit your code, choose an analysis type, and pay securely with Locus Checkout.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left — input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Input method tabs */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div className="tab-bar" style={{ marginBottom: '1.25rem' }}>
                {INPUT_TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    className={`tab-item ${inputMethod === id ? 'active' : ''}`}
                    onClick={() => setInputMethod(id)}
                  >
                    <Icon size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Paste */}
              {inputMethod === 'paste' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label className="label" style={{ margin: 0 }}>Your Code</label>
                    <button
                      onClick={loadDemo}
                      style={{
                        fontSize: '0.75rem',
                        color: '#a78bfa',
                        background: 'rgba(139,92,246,0.1)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        borderRadius: '0.375rem',
                        padding: '0.2rem 0.6rem',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Load demo code
                    </button>
                  </div>
                  <textarea
                    className="input textarea"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here…"
                    rows={16}
                    style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.8125rem' }}
                  />
                  <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {code.split('\n').length} lines · {code.length} characters
                  </p>
                </div>
              )}

              {/* File Upload */}
              {inputMethod === 'file' && (
                <div>
                  <div
                    className={`dropzone ${dragging ? 'dragging' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".js,.ts,.jsx,.tsx,.py,.rs,.go,.java,.cpp,.c,.cs,.rb,.php"
                      style={{ display: 'none' }}
                      onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
                    />
                    {fileName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                        <FileText size={24} color="#a78bfa" />
                        <div>
                          <p style={{ fontWeight: 600, color: '#f8f8fc' }}>{fileName}</p>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{code.split('\n').length} lines</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFileName(''); setCode(''); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload size={32} color="#7c3aed" style={{ margin: '0 auto 1rem' }} />
                        <p style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                          Drop a file or click to browse
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          .js .ts .py .rs .go .java .cpp and more
                        </p>
                      </div>
                    )}
                  </div>
                  {code && (
                    <div className="code-block" style={{ marginTop: '1rem', maxHeight: '200px', overflow: 'auto' }}>
                      {code.slice(0, 800)}{code.length > 800 ? '\n…' : ''}
                    </div>
                  )}
                </div>
              )}

              {/* GitHub PR */}
              {inputMethod === 'github-pr' && (
                <div>
                  <label className="label">GitHub Pull Request URL</label>
                  <input
                    className="input"
                    type="url"
                    value={githubPrUrl}
                    onChange={(e) => setGithubPrUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo/pull/123"
                  />
                  <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    We fetch the PR diff and analyze the changed lines. Public repos only in demo mode.
                  </p>
                  <button
                    onClick={() => setGithubPrUrl('https://github.com/example/repo/pull/42')}
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#a78bfa',
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.2)',
                      borderRadius: '0.375rem',
                      padding: '0.2rem 0.6rem',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Load demo PR URL
                  </button>
                </div>
              )}
            </div>

            {/* Language selector */}
            <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
              <label className="label">Language</label>
              <select
                className="input"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                {LANGUAGES.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right — analysis type & checkout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '5.5rem' }}>
            {/* Analysis type */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Analysis Type
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {ANALYSIS_TYPES.map((type) => {
                  const info = ANALYSIS_PRICING[type];
                  const active = analysisType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setAnalysisType(type)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.625rem',
                        background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                        border: `1px solid ${active ? 'rgba(139,92,246,0.4)' : 'transparent'}`,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400, color: active ? '#c4b5fd' : 'var(--text-secondary)' }}>
                        {info.label}
                      </span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: active ? '#a78bfa' : 'var(--text-muted)' }}>
                        ${(info.price / 100).toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checkout summary */}
            <div
              style={{
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: '1rem',
                padding: '1.25rem',
              }}
            >
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Order Summary
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{pricing.label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8f8fc' }}>${(pricing.price / 100).toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(139,92,246,0.15)', margin: '0.75rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, color: '#f8f8fc' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#a78bfa' }}>${(pricing.price / 100).toFixed(2)}</span>
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.875rem' }}>
                  <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span style={{ fontSize: '0.8125rem', color: '#f87171' }}>{error}</span>
                </div>
              )}

              <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%' }}>
                {loading ? <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> : <ChevronRight size={16} />}
                {loading ? 'Creating session…' : 'Pay with Locus'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                🔒 Mock mode — no real payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
