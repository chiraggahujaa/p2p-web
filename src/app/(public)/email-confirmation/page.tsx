import { Suspense } from 'react';
import EmailConfirmationContent from '@/components/auth/EmailConfirmationContent';

export default function EmailConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4">Loading…</div>}>
      <EmailConfirmationContent />
    </Suspense>
  );
}