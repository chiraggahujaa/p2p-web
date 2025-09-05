"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { UseFormReset } from "react-hook-form";
import { itemsAPI } from "@/lib/api/items";
import { type UploadedFile } from "@/types/items";
import {
  ProductFormData,
} from "../validation/productFormSchema";

interface ExtendedLocation {
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  addressLine?: string;
  pincode?: string;
  country?: string;
}

export function useProductFormData(
  productId: string | undefined,
  mode: 'create' | 'edit',
  isAuthenticated: boolean,
  reset: UseFormReset<ProductFormData>,
  setUploadedImages: (images: UploadedFile[]) => void
) {
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => itemsAPI.getById(productId!),
    enabled: !!productId && mode === 'edit' && isAuthenticated,
  });

  const product = productData?.data;

  // Populate form with existing data in edit mode
  useEffect(() => {
    if (product && mode === 'edit') {
      // Map API condition values to form condition values
      const mapCondition = (condition: string): "new" | "likeNew" | "good" | "fair" | "poor" => {
        switch (condition) {
          case "like_new": return "likeNew";
          case "new": return "new";
          case "good": return "good";
          case "fair": return "fair";
          case "poor": return "poor";
          default: return "good";
        }
      };

      const formData = {
        title: product.title,
        description: product.description || "",
        categoryId: product.categoryId,
        condition: mapCondition(product.condition),
        rentPricePerDay: product.rentPricePerDay,
        securityAmount: product.securityAmount || 0,
        deliveryMode: product.deliveryMode,
        minRentalDays: product.minRentalDays,
        maxRentalDays: product.maxRentalDays,
        isNegotiable: product.isNegotiable,
        tags: product.tags || [],
        ...(mode === 'edit' && { status: product.status }),
        location: product.location
          ? {
              addressLine:
                (product.location as ExtendedLocation).addressLine || "",
              city: product.location.city || "",
              state: product.location.state || "",
              pincode: (product.location as ExtendedLocation).pincode || "",
              country: (product.location as ExtendedLocation).country || "",
              latitude: product.location.latitude || undefined,
              longitude: product.location.longitude || undefined,
            }
          : null,
      };

      reset(formData);
    }
  }, [product, mode, reset]);

  // Separate effect for images to avoid reset conflicts
  useEffect(() => {
    if (product && mode === 'edit') {
      // Populate existing images
      if (product.images && product.images.length > 0) {
        const existingImages: UploadedFile[] = product.images.map(
          (img: { file?: { url?: string } }, index: number) => ({
            id: `existing-${index}`,
            name: `Product Image ${index + 1}`,
            originalName: `product-image-${index + 1}.jpg`,
            url: img.file?.url || '',
            fileType: "image",
            fileSize: 0,
            mimeType: "image/jpeg",
            isPublic: true,
            uploadedOn: new Date().toISOString(),
            userId: product.userId,
            bucket: "products",
            path: img.file?.url || '',
          })
        );
        setUploadedImages(existingImages);
      } else {
        setUploadedImages([]);
      }
    } else if (mode === 'create') {
      // Clear images for create mode
      setUploadedImages([]);
    }
  }, [product, mode, setUploadedImages]);

  return {
    product,
    productLoading,
    productError,
  };
}