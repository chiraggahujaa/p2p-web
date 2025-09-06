"use client";

import { useParams } from "next/navigation";
import { ProductViewPage } from "@/features/products/components/ProductViewPage";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;

  return <ProductViewPage productId={productId} />;
}