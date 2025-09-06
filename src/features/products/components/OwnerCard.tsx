"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Star, Shield, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";

interface Owner {
  fullName: string;
  avatarUrl?: string;
  trustScore: number;
}

interface OwnerCardProps {
  owner?: Owner;
  ownerId?: string;
}

export function OwnerCard({ owner, ownerId }: OwnerCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleViewProfile = () => {
    if (!ownerId) {
      toast.error("Owner profile not available");
      return;
    }
    router.push(`/profile/${ownerId}`);
  };

  const handleMessage = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to message the owner");
      router.push("/signin");
      return;
    }
    
    // TODO: Navigate to messaging
    toast.success("Messaging feature coming soon!");
  };

  if (!owner) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-slate-500">
          <User className="w-8 h-8 mx-auto mb-2" />
          <p>Owner information not available</p>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 4.5) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 3.5) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 2.5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getTrustLevel = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Fair";
    return "New";
  };

  return (
    <Card className="relative z-0">
      <CardHeader>
        <CardTitle className="text-lg">Owner</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={owner.avatarUrl} alt={owner.fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {getInitials(owner.fullName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 text-lg">{owner.fullName}</h3>
            
            <div className="flex items-center mt-2">
              <Badge 
                variant="outline" 
                className={`border ${getTrustScoreColor(owner.trustScore)} mr-2`}
              >
                <Shield className="w-3 h-3 mr-1" />
                Trust Score: {owner.trustScore.toFixed(1)}
              </Badge>
            </div>
            
            <p className="text-sm text-slate-600 mt-1">
              {getTrustLevel(owner.trustScore)} Reputation
            </p>
          </div>
        </div>

        {/* Trust Score Details */}
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Trust Level</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
              <span className="font-medium">{owner.trustScore.toFixed(1)} / 5.0</span>
            </div>
          </div>
          
          {/* Trust Score Bar */}
          <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(owner.trustScore / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            onClick={handleViewProfile}
            className="w-full"
          >
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleMessage}
            className="w-full"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message Owner
          </Button>
        </div>

        {/* Trust Tips */}
        <div className="text-xs text-slate-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="font-medium text-blue-800 mb-1">💡 Trust Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Check owner&apos;s profile and reviews</li>
            <li>Communicate through our platform</li>
            <li>Meet in public places for pickup</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}