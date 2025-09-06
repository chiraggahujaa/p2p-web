'use client';

import { UserProductsList } from '@/features/profile/components/UserProductsList';

interface ProductsTabProps {
  userId: string;
  isOwnProfile: boolean;
}

export function ProductsTab({ userId, isOwnProfile }: ProductsTabProps) {
  return (
    <div className="space-y-6 pb-8">
      <h2 className="text-xl font-semibold">
        {isOwnProfile ? "My Listed Items" : "Listed Items"}
      </h2>
      <UserProductsList userId={userId} isOwnProfile={isOwnProfile} />
    </div>
  );
}