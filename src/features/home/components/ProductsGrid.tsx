"use client";

import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ui/product-card";
import { Pagination } from "@/components/ui/pagination";
import { itemsAPI } from "@/lib/api/items";
import { type Item } from "@/types/items";
import { useHomeData } from "../hooks/useHomeData";
import { EmptyState } from "./EmptyState";
import { useRouter } from "next/navigation";

type ProductsGridProps = {
  selectedCategory: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setSelectedCategory: (category: string) => void;
  dateRange: { from: Date; to: Date };
  selectedCity: string | null;
  proximityEnabled: boolean;
  proximityRadius: number;
  userLocation: { latitude: number; longitude: number } | null;
  isHomePage: boolean;
};

export const ProductsGrid = ({
  selectedCategory,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  setSelectedCategory,
  dateRange,
  selectedCity,
  proximityEnabled,
  proximityRadius,
  userLocation,
  isHomePage,
}: ProductsGridProps) => {
  const router = useRouter();
  const { allCategories, itemsResponse, itemsLoading } = useHomeData({
    selectedCategory,
    currentPage,
    itemsPerPage,
    selectedCity,
    proximityEnabled,
    proximityRadius,
    userLocation,
    isHomePage,
  });

  const items = itemsResponse?.data?.data || [];
  const totalItems = itemsResponse?.data?.pagination?.total || 0;

  const calculateItemPrice = (item: Item) => {
    return itemsAPI.calculatePrice(
      item,
      dateRange.from.toISOString(),
      dateRange.to.toISOString()
    );
  };

  const getCategoryName = () => {
    if (!selectedCategory) return "All Items";
    if (selectedCategory === "other") return "Other Items";
    return (
      allCategories?.data?.find((c) => c.id === selectedCategory)?.categoryName ||
      "Items"
    );
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`, { scroll: true });
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {getCategoryName()}
            </h3>
            <p className="text-slate-600">
              {totalItems > 0
                ? `${totalItems} items found`
                : "No items found"}
            </p>
          </div>

          {totalItems > 0 && (
            <Badge variant="outline" className="w-fit">
              Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
            </Badge>
          )}
        </div>

        {/* Items */}
        {itemsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {[...Array(itemsPerPage)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-white rounded-xl animate-pulse shadow-sm"
              />
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
              {items.map((item: Item) => {
                const pricing = calculateItemPrice(item);
                return (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    pricing={pricing} 
                    onClick={() => handleProductClick(item.id)}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPageOptions={[15, 30, 50]}
              defaultItemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              className="border-t pt-8"
              scrollTarget="element"
              scrollElementId="categories-section"
            />
          </>
        ) : (
          <EmptyState
            selectedCategory={selectedCategory}
            getCategoryName={getCategoryName}
            onResetCategory={() => {
              setSelectedCategory("");
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </section>
  );
};
