"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { MapPin } from "lucide-react";
import { cn } from "@/utils/ui";
import { useBrowserLocation } from "@/hooks/useBrowserLocation";
import { toast } from "sonner";

export interface ProximitySelectorProps {
  enabled?: boolean;
  radius?: number;
  onEnabledChange?: (enabled: boolean) => void;
  onRadiusChange?: (radius: number) => void;
  className?: string;
  compact?: boolean;
}

export function ProximitySelector({
  enabled = true,
  radius = 25,
  onEnabledChange,
  onRadiusChange,
  className,
  compact = false
}: ProximitySelectorProps) {
  const { hasLocation, permission, requestLocation } = useBrowserLocation();

  // Local state for immediate UI updates
  const [localRadius, setLocalRadius] = useState(radius);

  // Sync local radius with prop when it changes externally
  useEffect(() => {
    setLocalRadius(radius);
  }, [radius]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Force disable if no location permission
  const isLocationBlocked = permission === 'denied' || !hasLocation;
  const effectiveEnabled = enabled && !isLocationBlocked;

  const handleEnabledChange = (checked: boolean) => {
    if (checked && !hasLocation) {
      // Request permission when trying to enable without location
      requestLocation();
      toast.info("Please allow location access to use proximity filtering");
      return;
    }
    onEnabledChange?.(checked);
  };

  // Debounced radius change to avoid too many API calls
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRadiusChange = useCallback((values: number[]) => {
    const newRadius = values[0] || 25;

    // Update local state immediately for UI responsiveness
    setLocalRadius(newRadius);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout to call the actual handler after 500ms
    debounceTimeoutRef.current = setTimeout(() => {
      onRadiusChange?.(newRadius);
    }, 500);
  }, [onRadiusChange]);

  const formatDistance = (km: number) => {
    if (km >= 500) return "500+ km";
    if (km <= 5) return `${km} km`;
    return `${km} km`;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Checkbox
          id="proximity-toggle"
          checked={effectiveEnabled}
          onCheckedChange={handleEnabledChange}
        />
        <div
          className={cn(
            "flex items-center gap-2 transition-opacity",
            (!effectiveEnabled || isLocationBlocked) && "opacity-50 pointer-events-none"
          )}
        >
          <MapPin className="size-4 text-muted-foreground" />
          {isLocationBlocked && (
            <span className="text-xs text-muted-foreground">
              Location blocked
            </span>
          )}
          <div className="flex items-center gap-2 min-w-[100px]">
            <Slider
              value={[localRadius]}
              onValueChange={handleRadiusChange}
              disabled={!effectiveEnabled}
              min={5}
              max={500}
              step={5}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground font-medium min-w-[40px]">
              {formatDistance(localRadius)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 p-4 border rounded-lg bg-background", className)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="proximity-enabled"
          checked={effectiveEnabled}
          onCheckedChange={handleEnabledChange}
        />
        <label
          htmlFor="proximity-enabled"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Filter by distance
        </label>
        {isLocationBlocked && (
          <span className="text-xs text-muted-foreground ml-2">
            (Location access required)
          </span>
        )}
      </div>

      <div
        className={cn(
          "space-y-3 transition-opacity",
          (!effectiveEnabled || isLocationBlocked) && "opacity-50 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">
            Search radius
          </label>
          <span className="text-sm font-medium">
            {formatDistance(localRadius)}
          </span>
        </div>

        <div className="px-1">
          <Slider
            value={[localRadius]}
            onValueChange={handleRadiusChange}
            disabled={!effectiveEnabled}
            min={5}
            max={500}
            step={5}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>5 km</span>
          <span>500+ km</span>
        </div>
      </div>
    </div>
  );
}

export default ProximitySelector;