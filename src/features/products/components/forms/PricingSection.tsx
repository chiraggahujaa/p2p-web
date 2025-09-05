"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PricingSectionProps } from "../../types/formTypes";

export function PricingSection({
  register,
  watch,
  setValue,
  errors,
  mode
}: PricingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing & Rental Terms</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? "Set your pricing and rental conditions"
            : "Update your pricing and rental conditions"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rentPricePerDay">Daily Rent Price (₹) *</Label>
            <Input
              id="rentPricePerDay"
              type="number"
              min="1"
              placeholder="100"
              {...register("rentPricePerDay", {
                required: "Daily rent price is required",
                min: { value: 1, message: "Price must be at least ₹1" },
                valueAsNumber: true,
              })}
            />
            {errors.rentPricePerDay && (
              <p className="text-sm text-destructive">
                {errors.rentPricePerDay.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="securityAmount">Security Deposit (₹)</Label>
            <Input
              id="securityAmount"
              type="number"
              min="0"
              placeholder="500"
              {...register("securityAmount", {
                min: {
                  value: 0,
                  message: "Security amount cannot be negative",
                },
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minRentalDays">Minimum Rental Days *</Label>
            <Input
              id="minRentalDays"
              type="number"
              min="1"
              placeholder="1"
              {...register("minRentalDays", {
                required: "Minimum rental days is required",
                min: {
                  value: 1,
                  message: "Minimum must be at least 1 day",
                },
                valueAsNumber: true,
              })}
            />
            {errors.minRentalDays && (
              <p className="text-sm text-destructive">
                {errors.minRentalDays.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxRentalDays">Maximum Rental Days *</Label>
            <Input
              id="maxRentalDays"
              type="number"
              min="1"
              placeholder="30"
              {...register("maxRentalDays", {
                required: "Maximum rental days is required",
                min: {
                  value: 1,
                  message: "Maximum must be at least 1 day",
                },
                valueAsNumber: true,
              })}
            />
            {errors.maxRentalDays && (
              <p className="text-sm text-destructive">
                {errors.maxRentalDays.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryMode">Delivery Mode *</Label>
          <Select
            onValueChange={(value) => setValue("deliveryMode", value as "pickup" | "delivery" | "both" | "none")}
            value={watch("deliveryMode")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="pickup">Pickup Only</SelectItem>
              <SelectItem value="delivery">Delivery Only</SelectItem>
              <SelectItem value="both">Both Pickup & Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="isNegotiable"
            type="checkbox"
            {...register("isNegotiable")}
            className="rounded"
          />
          <Label htmlFor="isNegotiable">Price is negotiable</Label>
        </div>
      </CardContent>
    </Card>
  );
}