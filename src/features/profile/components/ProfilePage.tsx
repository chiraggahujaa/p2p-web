'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '@/lib/api/users';
import { useAuth } from '@/hooks/useAuth';
import { useMyProfile, useUpdateProfile } from '@/features/profile/hooks/useProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/utils/ui';
import { User, MapPin, Package, ShoppingBag, BadgeCheck, Lock } from 'lucide-react';
import { ProfileTab } from '@/features/profile/components/tabs/ProfileTab';
import { OrdersTab } from '@/features/profile/components/tabs/OrdersTab';
import { ProductsTab } from '@/features/profile/components/tabs/ProductsTab';
import { AddressBookTab } from '@/features/profile/components/tabs/AddressBookTab';
import { DetailsTab } from '@/features/profile/components/tabs/DetailsTab';

type TabKey = 'profile' | 'orders' | 'products' | 'address-book' | 'details';

const privateTabs = [
  { key: 'profile' as TabKey, label: 'Profile', icon: User },
  { key: 'orders' as TabKey, label: 'Orders', icon: ShoppingBag },
  { key: 'products' as TabKey, label: 'Product Listing', icon: Package },
  { key: 'address-book' as TabKey, label: 'Address Book', icon: MapPin },
  { key: 'details' as TabKey, label: 'User Details', icon: User },
];

const publicTabs = [
  { key: 'profile' as TabKey, label: 'Profile', icon: User },
  { key: 'products' as TabKey, label: 'Product List', icon: Package },
];

export function ProfilePage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const userId = params?.id as string;
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  const { data: publicProfileRes } = useQuery({
    queryKey: ['public-profile', userId],
    queryFn: () => usersAPI.getPublicProfile(userId),
    enabled: !!userId && user?.id !== userId, // Only fetch if viewing someone else's profile
  });

  const { data: myProfileRes } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();

  const publicProfile = publicProfileRes?.data;
  const myProfile = myProfileRes?.data;
  const isOwnProfile = user?.id === userId;

  // Use myProfile for own profile, publicProfile for others
  const profileData = isOwnProfile ? myProfile : publicProfile;
  
  // Get appropriate tabs based on profile type
  const availableTabs = isOwnProfile ? privateTabs : publicTabs;

  // Reset active tab if viewing public profile and current tab is not allowed
  useEffect(() => {
    if (!isOwnProfile && !publicTabs.some(tab => tab.key === activeTab)) {
      setActiveTab('profile');
    }
  }, [isOwnProfile, activeTab]);

  // Loading state for public profiles
  if (!isOwnProfile && (!publicProfileRes || !publicProfile)) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  const renderTabContent = () => {
    // Prevent access to restricted tabs for public profiles
    if (!isOwnProfile && !publicTabs.some(tab => tab.key === activeTab)) {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Lock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
              <p className="text-muted-foreground">
                This section is only available to the profile owner.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab
            profileData={profileData}
            isOwnProfile={isOwnProfile}
            userId={userId}
            updateProfileMutation={updateProfileMutation}
          />
        );
      case 'orders':
        return (
          <OrdersTab
            profileData={profileData}
            isOwnProfile={isOwnProfile}
          />
        );
      case 'products':
        return <ProductsTab />;
      case 'address-book':
        return <AddressBookTab isOwnProfile={isOwnProfile} />;
      case 'details':
        return <DetailsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar with User Info and Navigation */}
      <aside className="w-full md:w-64 shrink-0 border-r bg-white">
        <div className="p-4 flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profileData?.avatarUrl || undefined} alt={profileData?.fullName || 'User'} />
            <AvatarFallback>{profileData?.fullName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium leading-tight flex items-center gap-1">
              {profileData?.fullName || user?.name || 'User'}
              {profileData?.isVerified && (
                <BadgeCheck className="h-4 w-4 text-blue-500" />
              )}
            </div>
            {isOwnProfile && user?.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
          </div>
        </div>
        <Separator />
        <nav className="p-2 space-y-1">
          {availableTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <IconComponent className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1">
        {renderTabContent()}
      </div>
    </div>
  );
}