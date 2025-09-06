"use client";

import { useState } from "react";
import { Calendar, Clock, Shield, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RangeDatePicker } from "@/components/ui/range-date-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { type Item } from "@/types/items";
import { itemsAPI } from "@/lib/api/items";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "sonner";

interface ProductBookingCardProps {
  product: Item;
}

export function ProductBookingCard({ product }: ProductBookingCardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Get stored dates from app store
  const storedStartDate = useAppStore((s) => s.startDate);
  const storedEndDate = useAppStore((s) => s.endDate);
  const setStoredDateRange = useAppStore((s) => s.setDateRange);
  
  // Initialize date range with stored dates if available
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (storedStartDate && storedEndDate) {
      return {
        from: new Date(storedStartDate),
        to: new Date(storedEndDate),
      };
    }
    return undefined;
  });

  // Handle date range changes and sync with store
  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    
    // Update the store with new dates
    if (newDateRange?.from && newDateRange?.to) {
      setStoredDateRange({
        startDate: newDateRange.from.toISOString().split('T')[0], // Format as YYYY-MM-DD
        endDate: newDateRange.to.toISOString().split('T')[0],
      });
    } else {
      setStoredDateRange({
        startDate: null,
        endDate: null,
      });
    }
  };

  const calculatePricing = () => {
    if (!dateRange?.from || !dateRange?.to) return null;
    
    return itemsAPI.calculatePrice(
      product,
      dateRange.from.toISOString(),
      dateRange.to.toISOString()
    );
  };

  const pricing = calculatePricing();

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book this item");
      router.push("/signin");
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select your rental dates");
      return;
    }

    // TODO: Navigate to booking flow
    toast.success("Booking feature coming soon!");
  };

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to contact the owner");
      router.push("/signin");
      return;
    }

    // TODO: Navigate to messaging or contact form
    toast.success("Contact feature coming soon!");
  };

  const isOwnItem = user?.id === product.userId;

  return (
    <Card className="sticky top-20 z-10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            ₹{product.rentPricePerDay.toLocaleString()}
            <span className="text-base font-normal text-slate-600"> / day</span>
          </span>
          {product.status === 'available' ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Available
            </Badge>
          ) : (
            <Badge variant="secondary">
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isOwnItem && product.status === 'available' && (
          <>
            {/* Date Selection */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Select Dates
              </label>
              <RangeDatePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                CalendarComponent={CalendarComponent}
                disablePast={true}
                className="w-full"
              />
              <p className="text-xs text-slate-500 mt-1">
                Min: {product.minRentalDays} days • Max: {product.maxRentalDays} days
              </p>
            </div>

            {/* Pricing Breakdown */}
            {pricing && (
              <div className="space-y-3">
                <div className="flex items-center text-sm font-medium text-slate-700">
                  <Calculator className="w-4 h-4 mr-1" />
                  Price Breakdown
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>₹{product.rentPricePerDay.toLocaleString()} x {pricing.totalDays} days</span>
                    <span>₹{pricing.totalPrice.toLocaleString()}</span>
                  </div>
                  
                  {pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({pricing.discountPercentage}%)</span>
                      <span>-₹{pricing.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{pricing.finalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {product.securityAmount && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center text-sm text-blue-800">
                      <Shield className="w-4 h-4 mr-1" />
                      <span className="font-medium">Security Deposit: </span>
                      <span className="ml-1">₹{product.securityAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Refundable after item return in good condition
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleBookNow} 
                className="w-full h-12 text-base font-semibold"
                disabled={!pricing || pricing.totalDays < product.minRentalDays || pricing.totalDays > product.maxRentalDays}
              >
                Book Now
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleContactOwner}
                className="w-full"
              >
                Contact Owner
              </Button>
            </div>

            {/* Rental Period Validation */}
            {pricing && (pricing.totalDays < product.minRentalDays || pricing.totalDays > product.maxRentalDays) && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center text-sm text-amber-800">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    Rental period must be between {product.minRentalDays}-{product.maxRentalDays} days
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Own Item Message */}
        {isOwnItem && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-slate-600 font-medium">This is your listing</p>
            <Button 
              variant="outline" 
              className="mt-3"
              onClick={() => router.push(`/products/${product.id}/edit`)}
            >
              Edit Listing
            </Button>
          </div>
        )}

        {/* Unavailable Item */}
        {!isOwnItem && product.status !== 'available' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-slate-600 font-medium mb-3">
              This item is currently {product.status.replace('_', ' ')}
            </p>
            <Button variant="outline" onClick={handleContactOwner}>
              Contact Owner for Updates
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}