"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { itemsAPI } from "@/lib/api/items";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductBookingCard } from "./ProductBookingCard";
import { OwnerCard } from "./OwnerCard";
import { SimilarProducts } from "./SimilarProducts";

interface ProductViewPageProps {
  productId: string;
}

export function ProductViewPage({ productId }: ProductViewPageProps) {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { data: productResponse, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => itemsAPI.getById(productId),
    enabled: Boolean(productId),
  });

  const product = productResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h1>
        <p className="text-slate-600 mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Info */}
          <div className="lg:col-span-2 space-y-8">
            <ProductImageGallery images={product.images || []} title={product.title} />
            <ProductInfo product={product} />
          </div>

          {/* Right Column - Booking and Owner */}
          <div className="space-y-6">
            <ProductBookingCard product={product} />
            <OwnerCard owner={product.owner} ownerId={product.userId} />
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <SimilarProducts productId={productId} categoryId={product.categoryId} />
        </div>
      </div>
    </div>
  );
}