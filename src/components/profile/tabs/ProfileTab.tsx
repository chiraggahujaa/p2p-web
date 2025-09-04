"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ProfileCompletionBar from "@/components/profile/ProfileCompletionBar";
import { AvatarEditor } from "@/components/profile/AvatarEditor";
import {
  Edit2,
  Save,
  X,
  BadgeCheck,
  Calendar,
  Mail,
  Phone,
  Eye,
  EyeOff,
  MapPin,
  User,
} from "lucide-react";
import {
  PublicUserProfile,
  MeProfile,
  UpdateMeProfilePayload,
} from "@/types/user";
import { UseMutationResult } from "@tanstack/react-query";

interface ProfileTabProps {
  profileData: PublicUserProfile | MeProfile | undefined;
  isOwnProfile: boolean;
  userId: string;
  updateProfileMutation: UseMutationResult<
    unknown,
    Error,
    UpdateMeProfilePayload,
    unknown
  >;
}

interface EditForm {
  fullName: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  dobVisibility: "private" | "friends" | "public";
  bio: string;
  avatarUrl: string;
}

export function ProfileTab({
  profileData,
  isOwnProfile,
  userId,
  updateProfileMutation,
}: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    fullName: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    dobVisibility: "private",
    bio: "",
    avatarUrl: "",
  });

  // Type guard function
  const isMyProfile = (
    profile: PublicUserProfile | MeProfile | undefined
  ): profile is MeProfile => {
    return isOwnProfile && profile !== undefined;
  };

  const handleEditStart = () => {
    // Only allow editing for own profile
    if (!isOwnProfile || !isMyProfile(profileData)) return;

    setEditForm({
      fullName: profileData.fullName || "",
      phoneNumber: profileData.phoneNumber || "",
      gender: profileData.gender || "",
      dob: profileData.dob || "",
      dobVisibility:
        (profileData.dobVisibility as "private" | "friends" | "public") ||
        "private",
      bio: profileData.bio || "",
      avatarUrl: profileData.avatarUrl || "",
    });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditForm({
      fullName: "",
      phoneNumber: "",
      gender: "",
      dob: "",
      dobVisibility: "private",
      bio: "",
      avatarUrl: "",
    });
  };

  const handleEditSave = async () => {
    if (!editForm.fullName.trim()) {
      return;
    }

    updateProfileMutation.mutate(
      {
        fullName: editForm.fullName,
        phoneNumber: editForm.phoneNumber || undefined,
        gender: editForm.gender || undefined,
        dob: editForm.dob || undefined,
        dobVisibility: editForm.dobVisibility,
        bio: editForm.bio || undefined,
        avatarUrl: editForm.avatarUrl || undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profile Details</h2>
        {isOwnProfile && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditCancel}
                  disabled={updateProfileMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditSave}
                  disabled={
                    updateProfileMutation.isPending || !editForm.fullName.trim()
                  }
                >
                  {updateProfileMutation.isPending ? (
                    <LoadingSpinner className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleEditStart}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      {isOwnProfile && isMyProfile(profileData) && (
        <ProfileCompletionBar
          profile={profileData}
          userId={userId}
          className="mb-6 py-0"
        />
      )}

      <div className="flex gap-6">
        {/* Avatar Editor */}
        <AvatarEditor
          currentAvatarUrl={
            isEditing ? editForm.avatarUrl : profileData?.avatarUrl || undefined
          }
          fullName={
            isEditing ? editForm.fullName : profileData?.fullName || undefined
          }
          isVerified={profileData?.isVerified || undefined}
          isEditing={isOwnProfile && isEditing}
          onAvatarChange={(avatarUrl) =>
            setEditForm((prev) => ({ ...prev, avatarUrl: avatarUrl || "" }))
          }
          disabled={!isOwnProfile || updateProfileMutation.isPending}
          className="flex-shrink-0"
          filePath="profile-avatars"
        />

        {/* Public Info Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Public Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Full Name */}
              <div>
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Full Name
                </div>
                {isEditing ? (
                  <Input
                    value={editForm.fullName}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="font-medium">
                    {profileData?.fullName || "—"}
                  </div>
                )}
              </div>

              {/* Email - Only for own profile */}
              {isOwnProfile && isMyProfile(profileData) && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </div>
                  <div className="font-medium">{profileData.email || "—"}</div>
                </div>
              )}

              {/* Phone Number - Only for own profile */}
              {isOwnProfile && isMyProfile(profileData) && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone Number
                  </div>
                  {isEditing ? (
                    <Input
                      value={editForm.phoneNumber}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="font-medium">
                      {profileData.phoneNumber || "—"}
                    </div>
                  )}
                </div>
              )}

              {/* Gender - Only for own profile */}
              {isOwnProfile && isMyProfile(profileData) && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Gender
                  </div>
                  {isEditing ? (
                    <Select
                      value={editForm.gender}
                      onValueChange={(value) =>
                        setEditForm((prev) => ({ ...prev, gender: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="preferNotToSay">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="font-medium">
                      {profileData.gender === "preferNotToSay"
                        ? "Prefer not to say"
                        : profileData.gender
                        ? profileData.gender.charAt(0).toUpperCase() +
                          profileData.gender.slice(1)
                        : "—"}
                    </div>
                  )}
                </div>
              )}

              {/* Date of Birth - Only for own profile */}
              {isOwnProfile && isMyProfile(profileData) && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Date of Birth
                  </div>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editForm.dob}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          dob: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="font-medium">
                      {profileData.dob
                        ? new Date(profileData.dob).toLocaleDateString()
                        : "—"}
                    </div>
                  )}
                </div>
              )}

              {/* DOB Visibility - Only for own profile */}
              {isOwnProfile &&
                isMyProfile(profileData) &&
                (isEditing || profileData.dob) && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      {profileData.dobVisibility === "public" ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      DOB Visibility
                    </div>
                    {isEditing ? (
                      <Select
                        value={editForm.dobVisibility}
                        onValueChange={(
                          value: "private" | "friends" | "public"
                        ) =>
                          setEditForm((prev) => ({
                            ...prev,
                            dobVisibility: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="friends">Friends only</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="font-medium capitalize">
                        {profileData.dobVisibility || "Private"}
                      </div>
                    )}
                  </div>
                )}
            </div>

            <Separator />

            {/* Status Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  Trust Score
                </div>
                <div className="font-medium text-lg">
                  {profileData?.trustScore ?? 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <BadgeCheck className="h-3 w-3" />
                  Verification Status
                </div>
                <div className="font-medium flex items-center gap-2">
                  {profileData?.isVerified ? (
                    <>
                      <BadgeCheck className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Verified</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Not Verified</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  Member Since
                </div>
                <div className="font-medium">
                  {profileData?.createdAt
                    ? new Date(profileData.createdAt).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </div>

            {/* Location */}
            {profileData?.location && (
              <>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </div>
                  <div className="font-medium">
                    {[profileData.location.city, profileData.location.state]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Bio */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">Bio</div>
              {isEditing ? (
                <Textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell others about yourself..."
                  className="max-w-2xl"
                  rows={3}
                />
              ) : (
                <div className="font-medium whitespace-pre-wrap">
                  {profileData?.bio || "—"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
