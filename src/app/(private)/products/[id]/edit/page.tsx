"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/features/products/components/ProductForm";
import { ProductFormHeader } from "@/features/products/components/ProductFormHeader";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProductFormHeader 
        title="Edit Product"
        description="Update your product listing"
      />
      <ProductForm mode="edit" productId={params.id} />
    </div>
  );
}
