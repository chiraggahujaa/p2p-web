"use client";

import { useState, useRef } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { addDays } from "date-fns";
import HeroSection from "@/features/home/components/HeroSection";
import { FeaturedCategories } from "@/features/home/components/FeaturedCategories";
import BrowseCategories from "@/features/home/components/BrowseCategories";
import { ProductsGrid } from "@/features/home/components/ProductsGrid";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);

  // Get date range from global store (from header)
  const startDate = useAppStore((s) => s.startDate);
  const endDate = useAppStore((s) => s.endDate);

  // Default date range if none selected
  const dateRange = {
    from: startDate ? new Date(startDate) : new Date(),
    to: endDate ? new Date(endDate) : addDays(new Date(), 1),
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <HeroSection />

      <FeaturedCategories
        categoriesRef={categoriesRef}
        onSelectCategory={setSelectedCategory}
      />

      <BrowseCategories
        categoriesRef={categoriesRef}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showAllCategories={showAllCategories}
        setShowAllCategories={setShowAllCategories}
      />

      <ProductsGrid
        selectedCategory={selectedCategory}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        setSelectedCategory={setSelectedCategory}
        dateRange={dateRange}
      />
    </div>
  );
}
