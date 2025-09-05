"use client";

import { ProductForm } from "@/features/products/components/ProductForm";
import { ProductFormHeader } from "@/features/products/components/ProductFormHeader";

export default function AddProductPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProductFormHeader 
        title="Add New Product"
        description="Create a new product listing for rent"
      />
      <ProductForm mode="create" />
    </div>
  );
}
