"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { MapPin } from "lucide-react";
import { cn } from "@/utils/ui";

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
  const handleEnabledChange = (checked: boolean) => {
    onEnabledChange?.(checked);
  };

  const handleRadiusChange = (values: number[]) => {
    const newRadius = values[0] || 25;
    onRadiusChange?.(newRadius);
  };

  const formatDistance = (km: number) => {
    if (km >= 100) return "100+ km";
    if (km <= 5) return `${km} km`;
    return `${km} km`;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Checkbox
          id="proximity-toggle"
          checked={enabled}
          onCheckedChange={handleEnabledChange}
        />
        <div 
          className={cn(
            "flex items-center gap-2 transition-opacity",
            !enabled && "opacity-50 pointer-events-none"
          )}
        >
          <MapPin className="size-4 text-muted-foreground" />
          <div className="flex items-center gap-2 min-w-[100px]">
            <Slider
              value={[radius]}
              onValueChange={handleRadiusChange}
              disabled={!enabled}
              min={5}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground font-medium min-w-[40px]">
              {formatDistance(radius)}
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
          checked={enabled}
          onCheckedChange={handleEnabledChange}
        />
        <label
          htmlFor="proximity-enabled"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Filter by distance
        </label>
      </div>
      
      <div 
        className={cn(
          "space-y-3 transition-opacity",
          !enabled && "opacity-50 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">
            Search radius
          </label>
          <span className="text-sm font-medium">
            {formatDistance(radius)}
          </span>
        </div>
        
        <div className="px-1">
          <Slider
            value={[radius]}
            onValueChange={handleRadiusChange}
            disabled={!enabled}
            min={5}
            max={100}
            step={5}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>5 km</span>
          <span>100+ km</span>
        </div>
      </div>
    </div>
  );
}

export default ProximitySelector;