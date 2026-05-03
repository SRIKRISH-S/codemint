import { Suspense } from 'react';
import MockPaymentPage from './page';

export default function MockPaymentLayout() {
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>}>
      <MockPaymentPage />
    </Suspense>
  );
}
