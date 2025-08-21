"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Item } from "@/lib/api/items";

interface ProductCardProps {
  item: Item;
  pricing: {
    totalDays: number;
    finalPrice: number;
    discountAmount: number;
    discountPercentage: number;
  };
  className?: string;
  variant?: "default" | "compact";
  showLocation?: boolean;
  showRating?: boolean;
  showCondition?: boolean;
  onClick?: () => void;
}

export function ProductCard({
  item,
  pricing,
  className,
  variant = "default",
  showLocation = true,
  showRating = true,
  showCondition = true,
  onClick,
}: ProductCardProps) {
  const isCompact = variant === "compact";

  return (
    <div 
      className={cn(
        "group overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("relative overflow-hidden rounded-t-xl", isCompact ? "aspect-square" : "aspect-[4/3]")}>
        {item.images && item.images.length > 0 ? (
          <Image
            src={item.images.find(img => img.isPrimary)?.file.url || item.images[0].file.url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500" />
        )}
        
        {/* Condition Badge */}
        {showCondition && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/95 text-slate-700 text-xs backdrop-blur-sm">
              {item.condition.replace('_', ' ')}
            </Badge>
          </div>
        )}
        
        {/* Rating */}
        {showRating && item.ratingAverage > 0 && (
          <div className="absolute top-3 right-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-medium ml-1">{item.ratingAverage.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className={cn("p-4", isCompact && "p-3")}>
        <h4 className={cn(
          "font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors",
          isCompact ? "text-sm" : "text-base"
        )}>
          {item.title}
        </h4>
        
        {showLocation && item.location && (
          <div className={cn("flex items-center text-slate-500 mb-3", isCompact ? "text-xs" : "text-sm")}>
            <MapPin className={cn("mr-1", isCompact ? "w-2.5 h-2.5" : "w-3 h-3")} />
            {item.location.city}, {item.location.state}
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center text-slate-600", isCompact ? "text-xs" : "text-sm")}>
              <Clock className={cn("mr-1", isCompact ? "w-2.5 h-2.5" : "w-3 h-3")} />
              {pricing.totalDays} {pricing.totalDays === 1 ? 'day' : 'days'}
            </div>
            <div className="text-right">
              <div className={cn("font-bold text-slate-900", isCompact ? "text-base" : "text-lg")}>
                ₹{pricing.finalPrice.toLocaleString()}
              </div>
              {pricing.discountAmount > 0 && (
                <div className="text-xs text-green-600 font-medium">
                  Save ₹{pricing.discountAmount.toLocaleString()}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500">
              ₹{item.rentPricePerDay}/day
            </div>
            {pricing.discountPercentage > 0 && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                {pricing.discountPercentage}% off
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;