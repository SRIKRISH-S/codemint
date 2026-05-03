import { Suspense } from 'react';
import DashboardPage from './page';

export default function DashboardLayout() {
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>}>
      <DashboardPage />
    </Suspense>
  );
}
