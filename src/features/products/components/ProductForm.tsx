/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { LocationSelector } from "@/components/forms/LocationSelector";
import { type UploadedFile } from "@/types/items";
import { BasicInfoSection } from "./forms/BasicInfoSection";
import { PricingSection } from "./forms/PricingSection";
import { ProductImagesSection } from "./forms/ProductImagesSection";
import { ProductTagsSection } from "./forms/ProductTagsSection";
import { ProductDeleteDialog } from "./ProductDeleteDialog";
import { useEditProductForm } from "../hooks/useProductForm";
import { useProductMutations } from "../hooks/useProductMutations";
import { useProductFormData } from "../hooks/useProductFormData";
import {
  ProductFormData,
} from "../validation/productFormSchema";

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export function ProductForm({ mode, productId }: ProductFormProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);

  const form = useEditProductForm(); // Both create and edit use same schema now

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = form;

  const { createItemMutation, updateItemMutation, deleteItemMutation } = useProductMutations();

  const { product, productLoading, productError } = useProductFormData(
    productId,
    mode,
    isAuthenticated,
    form.reset as any,
    setUploadedImages
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  // Check if user owns this product (for edit mode)
  const userOwnsProduct = product && user && product.userId === user.id;

  const onSubmit = async (data: ProductFormData) => {
    // Validate location is selected
    if (!data.location) {
      toast.error("Please select a location");
      return;
    }

    if (mode === 'create') {
      // Remove status field for create mode
      const { status: _status, ...createData } = data;
      createItemMutation.mutate({ formData: createData, uploadedImages });
    } else if (mode === 'edit' && productId) {
      updateItemMutation.mutate({ productId, formData: data, uploadedImages });
    }
  };

  const handleDelete = () => {
    if (productId) {
      deleteItemMutation.mutate(productId);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (mode === 'edit' && productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (mode === 'edit' && productError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'edit' && !userOwnsProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You don&apos;t have permission to edit this product.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isLoading = mode === 'create' 
    ? createItemMutation.isPending 
    : updateItemMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <BasicInfoSection
        register={register as any}
        watch={watch as any}
        setValue={setValue as any}
        errors={errors}
        mode={mode}
      />

      <PricingSection
        register={register as any}
        watch={watch as any}
        setValue={setValue as any}
        errors={errors}
        mode={mode}
      />

      <LocationSelector
        title="Location"
        description={
          mode === 'create'
            ? "This helps potential renters find and reach you"
            : "Update where the product is located"
        }
        setValue={setValue as any}
        watch={watch as any}
        errors={errors}
        locationFieldName="location"
        required={true}
        enableAddressBook={true}
      />

      <ProductImagesSection
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        mode={mode}
      />

      <ProductTagsSection
        watch={watch as any}
        setValue={setValue as any}
        mode={mode}
      />

      {/* Form Actions - Inline as discussed */}
      <div className="flex justify-between">
        {mode === 'edit' && (
          <ProductDeleteDialog
            onDelete={handleDelete}
            isDeleting={deleteItemMutation.isPending}
          />
        )}
        
        <div className={`flex gap-2 ${mode === 'create' ? 'ml-auto' : ''}`}>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              mode === 'create' ? 'Create Product' : 'Update Product'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}