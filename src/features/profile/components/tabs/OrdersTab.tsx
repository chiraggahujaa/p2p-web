'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import { PublicUserProfile, MeProfile } from '@/types/user';

interface OrdersTabProps {
  profileData: PublicUserProfile | MeProfile | undefined;
  isOwnProfile: boolean;
}

export function OrdersTab({ profileData, isOwnProfile }: OrdersTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {isOwnProfile ? 'My Orders' : `${profileData?.fullName || 'User'}'s Listings`}
      </h2>
      <Card>
        <CardContent className="p-8 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {isOwnProfile 
              ? 'Orders section coming soon...' 
              : 'User listings section coming soon...'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}