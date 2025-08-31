'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '@/lib/api/users';
import { UpdateMeProfilePayload } from '@/types/users-api';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

export default function EditProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const userId = params?.id as string;
  const queryClient = useQueryClient();
  // TODO: Replace with proper profile query - using empty object for now
  const meDetails = useMemo(() => ({
    fullName: null,
    email: null,
    avatarUrl: null,
    phoneNumber: null,
    gender: null,
    dob: null,
    dobVisibility: 'private' as const,
    bio: null,
  }), []);

  useEffect(() => {
    if (user && user.id !== userId) {
      router.replace(`/profile/${user.id}/edit`);
    }
  }, [router, user, userId]);

  const [form, setForm] = useState<UpdateMeProfilePayload>({
    fullName: '',
    phoneNumber: '',
    gender: '',
    dob: '',
    dobVisibility: 'private',
    bio: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (meDetails) {
      setForm({
        fullName: meDetails.fullName || '',
        phoneNumber: meDetails.phoneNumber || '',
        gender: meDetails.gender || '',
        dob: meDetails.dob || '',
        dobVisibility: (meDetails.dobVisibility || 'private') as 'private' | 'friends' | 'public',
        bio: meDetails.bio || '',
        avatarUrl: meDetails.avatarUrl || '',
      });
    }
  }, [meDetails]);

  const mutation = useMutation({
    mutationFn: (payload: UpdateMeProfilePayload) => usersAPI.updateMeProfile(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Profile updated');
        queryClient.invalidateQueries({ queryKey: ['me-profile'] });
      } else {
        toast.error(res.error || 'Update failed');
      }
    },
    onError: () => toast.error('Update failed'),
  });

  const handleChange = (key: keyof UpdateMeProfilePayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="flex gap-6">
      <Sidebar basePath={`/profile/${userId}`} user={{ name: meDetails?.fullName, email: meDetails?.email, avatarUrl: meDetails?.avatarUrl }} />
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Edit Profile</h1>
          <Button variant="secondary" asChild>
            <Link href={`/profile/${userId}`}>Cancel</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={form.fullName || ''} onChange={handleChange('fullName')} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={form.phoneNumber || ''} onChange={handleChange('phoneNumber')} placeholder="+1 555 123 4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" value={form.gender || ''} onChange={handleChange('gender')} placeholder="male/female/other" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={form.dob || ''} onChange={handleChange('dob')} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input id="avatar" value={form.avatarUrl || ''} onChange={handleChange('avatarUrl')} placeholder="https://..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" value={form.bio || ''} onChange={handleChange('bio')} placeholder="Tell others about you" />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button type="submit" disabled={mutation.isPending}>Save</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}


