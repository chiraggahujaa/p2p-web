"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { categoriesAPI } from "@/lib/api/categories";
import { BasicInfoSectionProps } from "../../types/formTypes";
import { CONDITION_OPTIONS } from "@/lib/constants/conditions";

export function BasicInfoSection({
  register,
  watch,
  setValue,
  errors,
  mode
}: BasicInfoSectionProps) {
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesAPI.getAll,
  });

  const categories = categoriesData?.data || [];

  if (categoriesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? "Provide essential details about your product"
            : "Update essential details about your product"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Product Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Professional DSLR Camera"
            {...register("title", {
              required: "Product title is required",
              minLength: {
                value: 5,
                message: "Title must be at least 5 characters",
              },
            })}
          />
          {errors.title && (
            <p className="text-sm text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your product, its features, and condition..."
            rows={4}
            {...register("description")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            onValueChange={(value) => setValue("categoryId", value)}
            value={watch("categoryId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-destructive">Category is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition *</Label>
          <Select
            onValueChange={(value) => setValue("condition", value as "new" | "good" | "fair" | "poor" | "likeNew")}
            value={watch("condition")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_OPTIONS.map((condition) => (
                <SelectItem key={condition.value} value={condition.formValue}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.condition && (
            <p className="text-sm text-destructive">
              Condition is required
            </p>
          )}
        </div>

        {mode === 'edit' && (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue("status", value as "available" | "booked" | "in_transit" | "unavailable")}
              value={watch("status")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}