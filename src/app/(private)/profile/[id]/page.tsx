'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '@/lib/api/users';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileCompletionDialog from '@/components/profile/ProfileCompletionDialog';

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const { user, profile: meProfile } = useAuth();
  const userId = params?.id as string;
  const meProfileDetails = (meProfile as { profile?: { fullName?: string | null; email?: string | null; avatarUrl?: string | null } } | null)?.profile || null;

  const { data: publicProfileRes } = useQuery({
    queryKey: ['public-profile', userId],
    queryFn: () => usersAPI.getPublicProfile(userId),
    enabled: !!userId,
  });

  const publicProfile = publicProfileRes?.data;

  return (
    <div className="flex gap-6">
      <Sidebar
        basePath={`/profile/${userId}`}
        user={{
          name: meProfileDetails?.fullName || publicProfile?.fullName || user?.name || null,
          email: meProfileDetails?.email || user?.email || null,
          avatarUrl: meProfileDetails?.avatarUrl || publicProfile?.avatarUrl || null,
        }}
      />

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Profile</h1>
          {user?.id === userId && (
            <Button asChild>
              <Link href={`/profile/${userId}/edit`}>Edit</Link>
            </Button>
          )}
        </div>

        {user?.id === userId && (
          <ProfileCompletionDialog profile={meProfileDetails as Record<string, unknown> | null} userId={userId} />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Public Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Full Name</div>
              <div className="font-medium">{publicProfile?.fullName || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Trust Score</div>
              <div className="font-medium">{publicProfile?.trustScore ?? 0}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Verified</div>
              <div className="font-medium">{publicProfile?.isVerified ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="font-medium">{publicProfile?.location ? `${publicProfile.location.city || ''}${publicProfile.location.city && publicProfile.location.state ? ', ' : ''}${publicProfile.location.state || ''}` : '—'}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-muted-foreground">Bio</div>
              <div className="font-medium">{publicProfile?.bio || '—'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


