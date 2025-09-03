'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AddressBook } from '@/components/profile/AddressBook';
import { Lock } from 'lucide-react';

interface AddressBookTabProps {
  isOwnProfile: boolean;
}

export function AddressBookTab({ isOwnProfile }: AddressBookTabProps) {
  if (!isOwnProfile) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Address Book</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Lock className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Private Information</h3>
            <p className="text-muted-foreground">
              Address book information is only visible to the profile owner.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AddressBook />
    </div>
  );
}