"use client";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  selectedCategory: string;
  getCategoryName: () => string;
  onResetCategory: () => void;
};

export const EmptyState = ({
  selectedCategory,
  getCategoryName,
  onResetCategory,
}: EmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <div className="text-slate-400 mb-6">
        <svg
          className="w-20 h-20 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2"
          />
        </svg>
      </div>
      <h4 className="text-xl font-semibold text-slate-600 mb-3">
        No items found
      </h4>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        {selectedCategory
          ? `No items available in ${getCategoryName()} category. Try selecting a different category.`
          : "No items are currently available. Please check back later."}
      </p>
      {selectedCategory && (
        <Button onClick={onResetCategory} variant="outline">
          Browse All Items
        </Button>
      )}
    </div>
  );
};
