import { Suspense } from 'react';
import CheckoutPage from './page';

export default function CheckoutLayout() {
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading checkout…</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
