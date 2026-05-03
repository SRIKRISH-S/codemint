'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, LayoutDashboard, ShieldCheck, Settings, Zap } from 'lucide-react';

const NAV_LINKS = [
  { href: '/analyze',   label: 'Analyze',   icon: Code2 },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin',     label: 'Admin',     icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: '4.5rem',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139,92,246,0.12)',
      }}
    >
      <div
        className="section-container"
        style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '0.625rem',
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(124,58,237,0.4)',
            }}
          >
            <ShieldCheck size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#f8f8fc', letterSpacing: '-0.02em' }}>
            Code<span style={{ color: '#a78bfa' }}>Mint</span>{' '}
            <span style={{ fontSize: '0.75rem', background: 'rgba(139,92,246,0.2)', color: '#a78bfa', padding: '0.1rem 0.4rem', borderRadius: '0.375rem', fontWeight: 600 }}>
              AI
            </span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: active ? '#c4b5fd' : '#a1a1b5',
                  background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
                  border: active ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link href="/analyze" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
          <Zap size={15} />
          Analyze Code
        </Link>
      </div>
    </nav>
  );
}
