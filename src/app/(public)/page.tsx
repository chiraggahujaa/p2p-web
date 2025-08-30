"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, ArrowRight, TrendingUp, ChevronDown } from "lucide-react";
import { categoriesAPI } from "@/lib/api/categories";
import { itemsAPI, type Item } from "@/lib/api/items";
import { cn } from "@/utils/ui";
import Image from "next/image";
import { CategoryNavigation } from "@/components/ui/category-navigation";
import { Pagination } from "@/components/ui/pagination";
import { ProductCard } from "@/components/ui/product-card";
import { useAppStore } from "@/stores/useAppStore";
import { format, addDays } from "date-fns";

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

  // Fetch popular categories for featured section
  const { data: popularCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", "popular"],
    queryFn: categoriesAPI.getPopular,
  });

  // Fetch all categories for horizontal navigation
  const { data: allCategories, isLoading: allCategoriesLoading } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoriesAPI.getAll,
  });

  // Fetch items with pagination
  const { data: itemsResponse, isLoading: itemsLoading } = useQuery({
    queryKey: ["items", selectedCategory, currentPage, itemsPerPage],
    queryFn: () => {
      const filters = {
        limit: itemsPerPage,
        page: currentPage,
        ...(selectedCategory && selectedCategory !== "other" ? { categoryId: selectedCategory } : {}),
      };
      return itemsAPI.search(filters);
    },
    enabled: true,
  });

  const calculateItemPrice = (item: Item) => {
    return itemsAPI.calculatePrice(item, dateRange.from.toISOString(), dateRange.to.toISOString());
  };

  const featuredCategories = popularCategories?.data?.slice(0, 4) || [];
  const items = itemsResponse?.data?.items || [];
  const totalItems = itemsResponse?.data?.pagination?.total || 0;

  // Handle category click from featured section
  const handleFeaturedCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    
    // Smooth scroll to categories section
    if (categoriesRef.current) {
      const offset = 100; // Account for fixed header
      const elementTop = categoriesRef.current.offsetTop - offset;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  };

  // Handle category selection from navigation
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getCategoryName = () => {
    if (!selectedCategory) return "All Items";
    if (selectedCategory === "other") return "Other Items";
    return allCategories?.data?.find(c => c.id === selectedCategory)?.categoryName || "Items";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section - Updated tagline */}
      <section className="relative pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Rent Smart, Live Better
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Borrow. Share. Thrive.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Access what you need, when you need it. Join thousands who choose sharing over owning.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Categories Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-slate-600">
              Discover our most rented categories
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-72 bg-slate-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 bg-white"
                  onClick={() => handleFeaturedCategoryClick(category.id)}
                >
                  <div className="aspect-[3/4] relative overflow-hidden rounded-2xl">
                    {category.bannerUrl ? (
                      <Image
                        src={category.bannerUrl}
                        alt={category.categoryName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500" />
                    )}
                    
                    {/* Modern overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-semibold text-white mb-2 leading-tight">
                        {category.categoryName}
                      </h3>
                      <p className="text-sm text-white/85 line-clamp-2 mb-3 leading-relaxed">
                        {category.description || "Discover amazing rentals in this category"}
                      </p>
                      {category.itemCount && (
                        <Badge variant="secondary" className="bg-white/95 text-slate-800 text-xs">
                          {category.itemCount} items
                        </Badge>
                      )}
                    </div>
                    
                    {/* Modern arrow indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2.5">
                        <ArrowRight className="w-4 h-4 text-slate-700" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Browse All Categories Section */}
      <section id="categories-section" ref={categoriesRef} className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Browse All Categories</h3>
              <p className="text-slate-600">Find exactly what you&apos;re looking for</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="hidden sm:flex"
            >
              {showAllCategories ? "Hide" : "Show All"}
              <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", showAllCategories && "rotate-180")} />
            </Button>
          </div>
          
          {allCategoriesLoading ? (
            <div className="flex space-x-4 overflow-hidden px-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-32 h-20 bg-slate-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <CategoryNavigation
              categories={allCategories?.data || []}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              showAll={showAllCategories}
            />
          )}
        </div>
      </section>

      {/* Enhanced Products Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {getCategoryName()}
              </h3>
              <p className="text-slate-600">
                {totalItems > 0 ? `${totalItems} items found` : "No items found"}
              </p>
            </div>
            
            {totalItems > 0 && (
              <Badge variant="outline" className="w-fit">
                Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
              </Badge>
            )}
          </div>

          {itemsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-xl animate-pulse shadow-sm" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
                {items.map((item) => {
                  const pricing = calculateItemPrice(item);
                  return (
                    <ProductCard
                      key={item.id}
                      item={item}
                      pricing={pricing}
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
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                className="border-t pt-8"
                scrollTarget="element"
                scrollElementId="categories-section"
              />
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-slate-400 mb-6">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-600 mb-3">No items found</h4>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {selectedCategory 
                  ? `No items available in ${getCategoryName()} category. Try selecting a different category.`
                  : "No items are currently available. Please check back later."
                }
              </p>
              {selectedCategory && (
                <Button onClick={() => handleCategorySelect("")} variant="outline">
                  Browse All Items
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}