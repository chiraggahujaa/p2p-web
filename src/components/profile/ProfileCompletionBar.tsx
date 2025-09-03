'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/ui';

import { MeProfile } from '@/types/user';

interface ProfileCompletionBarProps {
  profile?: MeProfile | null;
  userId: string;
  className?: string;
}

export function ProfileCompletionBar({ profile, userId, className }: ProfileCompletionBarProps) {
  const completion = useMemo(() => {
    const requiredKeys = ['fullName', 'email', 'phoneNumber', 'avatarUrl', 'bio'] as const;
    const p = profile || {} as MeProfile;
    const present = requiredKeys.filter((key) => !!p[key]);
    
    // Profile completion is 50% of total
    const profilePercent = (present.length / requiredKeys.length) * 50;
    
    // KYC verification is the other 50%
    const kycPercent = p.isVerified ? 50 : 0;
    
    const totalPercent = Math.round(profilePercent + kycPercent);
    
    return {
      percent: Math.max(0, Math.min(100, totalPercent)),
      profilePercent: Math.round(profilePercent),
      completedFields: present.length,
      totalFields: requiredKeys.length,
      isVerified: !!p.isVerified,
    };
  }, [profile]);

  // Don't show if profile is 100% complete
  if (completion.percent >= 100) {
    return null;
  }

  return (
    <Card className={cn("border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50", className)}>
      <CardContent className={cn("px-4 py-6")}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              {completion.percent >= 80 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Profile {completion.percent}% complete
                  </p>
                  <p className="text-xs text-gray-600">
                    {completion.percent >= 80 
                      ? "Almost there! Complete your profile to maximize visibility."
                      : "Enhance your profile to build trust and increase visibility."}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">
                    {completion.completedFields}/{completion.totalFields} fields
                  </span>
                  <div className="text-xs text-gray-500">
                    {completion.isVerified ? '✓ Verified' : '○ KYC Pending'}
                  </div>
                </div>
              </div>
              
              <Progress 
                value={completion.percent} 
                className="h-2 bg-gray-200"
              />
            </div>
          </div>

          <div className="flex-shrink-0 flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/profile/${userId}/edit`}>
                Complete Profile
              </Link>
            </Button>
            {!completion.isVerified && (
              <Button size="sm" asChild>
                <Link href="/kyc">
                  Verify Identity
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileCompletionBar;