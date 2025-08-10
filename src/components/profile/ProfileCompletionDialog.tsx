'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProfileCompletionDialogProps {
  profile?: Record<string, unknown> | null;
  userId: string;
}

export function ProfileCompletionDialog({ profile, userId }: ProfileCompletionDialogProps) {
  const [open, setOpen] = useState(false);

  const completion = useMemo(() => {
    const requiredKeys = ['fullName', 'email', 'phoneNumber', 'avatarUrl', 'bio'] as const;
    const p = (profile || {}) as Record<string, unknown>;
    const present = requiredKeys.filter((key) => !!p[key]);
    const percent = Math.round((present.length / requiredKeys.length) * 100);
    return Math.max(0, Math.min(100, percent));
  }, [profile]);

  useEffect(() => {
    if (completion < 100) setOpen(true);
  }, [completion]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete your profile</DialogTitle>
          <DialogDescription>
            Your profile is {completion}% complete. Please add missing details to increase trust and visibility.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button variant="secondary" asChild>
            <Link href={`/profile/${userId}/edit`}>Edit Profile</Link>
          </Button>
          <Button asChild>
            <Link href={`/kyc`}>Do KYC</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileCompletionDialog;


