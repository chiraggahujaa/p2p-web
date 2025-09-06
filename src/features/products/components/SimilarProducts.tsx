"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ui/product-card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { itemsAPI } from "@/lib/api/items";
import { type Item } from "@/types/items";
import { useRouter } from "next/navigation";

interface SimilarProductsProps {
  productId: string;
  categoryId: string;
}

export function SimilarProducts({ productId, categoryId }: SimilarProductsProps) {
  const router = useRouter();

  const { data: similarResponse, isLoading } = useQuery({
    queryKey: ["similar-products", productId],
    queryFn: () => itemsAPI.getSimilar(productId, 8),
    enabled: Boolean(productId),
  });

  // Fallback to category-based products if no similar items
  const { data: categoryResponse } = useQuery({
    queryKey: ["category-products", categoryId],
    queryFn: () => itemsAPI.getByCategory(categoryId, 8),
    enabled: Boolean(categoryId) && (!similarResponse?.data || (similarResponse?.data?.length ?? 0) === 0),
  });

  const products = (similarResponse?.data?.length ?? 0) > 0 
    ? similarResponse?.data || []
    : categoryResponse?.data?.data || [];

  const filteredProducts = products.filter((product: Item) => product.id !== productId);

  const calculateItemPrice = (item: Item) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 3); // Default 3-day rental for preview

    return itemsAPI.calculatePrice(
      item,
      today.toISOString(),
      tomorrow.toISOString()
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return null;
  }

  const handleProductClick = (product: Item) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {(similarResponse?.data?.length ?? 0) > 0 ? "Similar Items" : "More in this Category"}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.slice(0, 4).map((product: Item) => {
          const pricing = calculateItemPrice(product);
          return (
            <ProductCard
              key={product.id}
              item={product}
              pricing={pricing}
              onClick={() => handleProductClick(product)}
              className="cursor-pointer"
            />
          );
        })}
      </div>

      {filteredProducts.length > 4 && (
        <div className="text-center mt-8">
          <button
            onClick={() => router.push(`/?category=${categoryId}`)}
            className="text-primary hover:text-primary/80 font-medium text-lg underline underline-offset-4"
          >
            View More Items
          </button>
        </div>
      )}
    </div>
  );
}