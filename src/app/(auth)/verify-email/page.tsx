import { Suspense } from 'react';
import VerifyEmailContent from '@/features/auth/components/VerifyEmailContent';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4">Loading…</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
