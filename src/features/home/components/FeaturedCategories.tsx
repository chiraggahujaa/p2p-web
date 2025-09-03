"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useHomeData } from "../hooks/useHomeData";

type FeaturedCategoriesProps = {
  categoriesRef: React.RefObject<HTMLDivElement | null>;
  onSelectCategory: (categoryId: string) => void;
};

export const FeaturedCategories = ({ categoriesRef, onSelectCategory }: FeaturedCategoriesProps) => {
  const { popularCategories, categoriesLoading } = useHomeData("", 1, 15);

  const featuredCategories = popularCategories?.data?.slice(0, 4) || [];

  const handleFeaturedCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
    if (categoriesRef?.current) {
      const offset = 100; 
      const elementTop = categoriesRef.current.offsetTop - offset;
      window.scrollTo({
        top: elementTop,
        behavior: "smooth",
      });
    }
  };

  return (
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

                  {/* Overlay */}
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

                  {/* Arrow indicator */}
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
  );
};
