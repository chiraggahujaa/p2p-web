"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { itemsAPI } from "@/lib/api/items";
import { type CreateItemDto, type UpdateItemDto, type UploadedFile } from "@/types/items";
import {
  CreateProductFormData,
  EditProductFormData,
} from "../validation/productFormSchema";

export function useProductMutations() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createItemMutation = useMutation({
    mutationFn: async (data: { formData: CreateProductFormData; uploadedImages: UploadedFile[] }) => {
      const createData: CreateItemDto = {
        title: data.formData.title,
        description: data.formData.description,
        categoryId: data.formData.categoryId,
        condition: data.formData.condition as CreateItemDto["condition"],
        rentPricePerDay: data.formData.rentPricePerDay,
        securityAmount: data.formData.securityAmount,
        addressData: data.formData.location
          ? {
              addressLine: data.formData.location.addressLine,
              city: data.formData.location.city,
              state: data.formData.location.state,
              pincode: data.formData.location.pincode,
              country: data.formData.location.country,
              latitude: data.formData.location.latitude,
              longitude: data.formData.location.longitude,
            }
          : undefined,
        deliveryMode: data.formData.deliveryMode as CreateItemDto["deliveryMode"],
        minRentalDays: data.formData.minRentalDays,
        maxRentalDays: data.formData.maxRentalDays,
        isNegotiable: data.formData.isNegotiable,
        tags: data.formData.tags,
        imageUrls: data.uploadedImages.map((img) => img.url),
      };

      return itemsAPI.create(createData);
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (data: { 
      productId: string; 
      formData: EditProductFormData; 
      uploadedImages: UploadedFile[] 
    }) => {
      const updateData: UpdateItemDto = {
        title: data.formData.title,
        description: data.formData.description,
        categoryId: data.formData.categoryId,
        condition: data.formData.condition as UpdateItemDto["condition"],
        rentPricePerDay: data.formData.rentPricePerDay,
        securityAmount: data.formData.securityAmount,
        addressData: data.formData.location
          ? {
              addressLine: data.formData.location.addressLine,
              city: data.formData.location.city,
              state: data.formData.location.state,
              pincode: data.formData.location.pincode,
              country: data.formData.location.country,
              latitude: data.formData.location.latitude,
              longitude: data.formData.location.longitude,
            }
          : undefined,
        deliveryMode: data.formData.deliveryMode as UpdateItemDto["deliveryMode"],
        minRentalDays: data.formData.minRentalDays,
        maxRentalDays: data.formData.maxRentalDays,
        isNegotiable: data.formData.isNegotiable,
        tags: data.formData.tags,
        status: data.formData.status as UpdateItemDto["status"],
        imageUrls: data.uploadedImages.map((img) => img.url),
      };

      return itemsAPI.update(data.productId, updateData);
    },
    onSuccess: (_, variables) => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      return itemsAPI.delete(productId);
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

  return {
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
  };
}