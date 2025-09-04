"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { categoriesAPI } from "@/lib/api/categories";
import { itemsAPI } from "@/lib/api/items";
import { type UpdateItemDto, type UploadedFile } from "@/types/items";
import { ImageUpload } from "@/components/ui/image-upload";
import { LocationCard } from "@/components/forms/LocationCard";
import { ArrowLeft, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { CreateLocationDto } from "@/types/location";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExtendedLocation {
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  addressLine?: string;
  pincode?: string;
  country?: string;
}

interface ProductFormData {
  title: string;
  description: string;
  categoryId: string;
  condition: string;
  rentPricePerDay: number;
  securityAmount?: number;
  deliveryMode: string;
  minRentalDays: number;
  maxRentalDays: number;
  isNegotiable: boolean;
  tags: string[];
  status: string;
  location: CreateLocationDto | null;
}

export default function EditProductPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);

  const productId = params?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      condition: "",
      rentPricePerDay: 0,
      securityAmount: 0,
      deliveryMode: "none",
      minRentalDays: 1,
      maxRentalDays: 30,
      isNegotiable: false,
      tags: [],
      status: "available",
      location: null,
    },
  });

  const watchedTags = watch("tags");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  // Fetch product details
  const { data: productData, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => itemsAPI.getById(productId!),
    enabled: !!productId && isAuthenticated,
  });

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesAPI.getAll,
  });

  // Check if user owns this product
  const product = productData?.data;
  const userOwnsProduct = product && user && product.userId === user.id;

  // Populate form with existing data
  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description || "",
        categoryId: product.categoryId,
        condition: product.condition,
        rentPricePerDay: product.rentPricePerDay,
        securityAmount: product.securityAmount || 0,
        deliveryMode: product.deliveryMode,
        minRentalDays: product.minRentalDays,
        maxRentalDays: product.maxRentalDays,
        isNegotiable: product.isNegotiable,
        tags: product.tags || [],
        status: product.status,
        location: product.location ? {
          addressLine: (product.location as ExtendedLocation).addressLine || "",
          city: product.location.city || "",
          state: product.location.state || "",
          pincode: (product.location as ExtendedLocation).pincode || "",
          country: (product.location as ExtendedLocation).country || "",
          latitude: product.location.latitude || undefined,
          longitude: product.location.longitude || undefined,
        } : null,
      });

      // Populate existing images
      if (product.images && product.images.length > 0) {
        const existingImages: UploadedFile[] = product.images.map((img, index) => ({
          id: `existing-${index}`,
          name: `Product Image ${index + 1}`,
          originalName: `product-image-${index + 1}.jpg`,
          url: img.file.url,
          fileType: 'image',
          fileSize: 0,
          mimeType: 'image/jpeg',
          isPublic: true,
          uploadedOn: new Date().toISOString(),
          userId: product.userId,
          bucket: 'products',
          path: img.file.url,
        }));
        setUploadedImages(existingImages);
      }
    }
  }, [product, reset]);

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const updateData: UpdateItemDto = {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        condition: data.condition as UpdateItemDto['condition'],
        rentPricePerDay: data.rentPricePerDay,
        securityAmount: data.securityAmount,
        addressData: data.location ? {
          addressLine: data.location.addressLine,
          city: data.location.city,
          state: data.location.state,
          pincode: data.location.pincode,
          country: data.location.country,
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        } : undefined,
        deliveryMode: data.deliveryMode as UpdateItemDto['deliveryMode'],
        minRentalDays: data.minRentalDays,
        maxRentalDays: data.maxRentalDays,
        isNegotiable: data.isNegotiable,
        tags: data.tags,
        status: data.status as UpdateItemDto['status'],
        imageUrls: uploadedImages.map(img => img.url),
      };
      
      return itemsAPI.update(productId!, updateData);
    },
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async () => {
      return itemsAPI.delete(productId!);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    // Validate location is selected
    if (!data.location) {
      toast.error("Please select a location");
      return;
    }
    updateItemMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteItemMutation.mutate();
  };

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      const newTags = [...watchedTags, tagInput.trim()];
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = watchedTags.filter(tag => tag !== tagToRemove);
    setValue("tags", newTags);
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (productLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (productError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!userOwnsProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You don&apos;t have permission to edit this product.</p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const categories = categoriesData?.data || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update your product listing</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update essential details about your product
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
                  minLength: { value: 5, message: "Title must be at least 5 characters" }
                })}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
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
                onValueChange={(value) => setValue("condition", value)}
                value={watch("condition")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="likeNew">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
              {errors.condition && (
                <p className="text-sm text-destructive">Condition is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={(value) => setValue("status", value)}
                value={watch("status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Rental Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Rental Terms</CardTitle>
            <CardDescription>
              Update your pricing and rental conditions
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
                  <p className="text-sm text-destructive">{errors.rentPricePerDay.message}</p>
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
                    min: { value: 0, message: "Security amount cannot be negative" },
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
                    min: { value: 1, message: "Minimum must be at least 1 day" },
                    valueAsNumber: true,
                  })}
                />
                {errors.minRentalDays && (
                  <p className="text-sm text-destructive">{errors.minRentalDays.message}</p>
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
                    min: { value: 1, message: "Maximum must be at least 1 day" },
                    valueAsNumber: true,
                  })}
                />
                {errors.maxRentalDays && (
                  <p className="text-sm text-destructive">{errors.maxRentalDays.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryMode">Delivery Mode *</Label>
              <Select 
                onValueChange={(value) => setValue("deliveryMode", value)}
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

        {/* Location */}
        <LocationCard
          title="Location"
          description="Update where the product is located"
          setValue={setValue}
          watch={watch}
          errors={errors}
          locationFieldName="location"
          required={true}
        />

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Update product images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              maxFiles={5}
              maxSizeBytes={5 * 1024 * 1024} // 5MB
              onFilesChange={setUploadedImages}
              existingFiles={uploadedImages}
              onUploadError={(error) => toast.error(error)}
            />
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Update tags to help users find your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyPress}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            
            {watchedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                type="button" 
                variant="outline"
                disabled={deleteItemMutation.isPending}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteItemMutation.isPending ? "Deleting..." : "Delete Product"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-none shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your product listing 
                  and remove all associated data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                >
                  Delete Product
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateItemMutation.isPending}
              className="min-w-[120px]"
            >
              {updateItemMutation.isPending ? (
                <LoadingSpinner />
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}