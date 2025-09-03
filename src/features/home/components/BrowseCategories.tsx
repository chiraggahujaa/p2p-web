import { Button } from '@/components/ui/button'
import { CategoryNavigation } from '@/components/ui/category-navigation'
import { cn } from '@/utils/ui'
import { ChevronDown } from 'lucide-react'
import React, { MutableRefObject } from 'react'
import { useHomeData } from '../hooks/useHomeData'

type BrowseCategoriesProps = {
  categoriesRef: MutableRefObject<HTMLDivElement | null>;
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  showAllCategories: boolean;
  setShowAllCategories: (value: boolean) => void;
};

const BrowseCategories = ({
  categoriesRef,
  showAllCategories,
  setShowAllCategories,
  selectedCategory,
  setSelectedCategory
}: BrowseCategoriesProps) => {
  const { allCategories, allCategoriesLoading } = useHomeData("", 1, 15);
  return (
     <section
        id="categories-section"
        ref={categoriesRef}
        className="py-12 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Browse All Categories
              </h3>
              <p className="text-slate-600">
                Find exactly what you&apos;re looking for
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="hidden sm:flex"
            >
              {showAllCategories ? "Hide" : "Show All"}
              <ChevronDown
                className={cn(
                  "ml-2 h-4 w-4 transition-transform",
                  showAllCategories && "rotate-180"
                )}
              />
            </Button>
          </div>

          {allCategoriesLoading ? (
            <div className="flex space-x-4 overflow-hidden px-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-32 h-20 bg-slate-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <CategoryNavigation
              categories={allCategories?.data || []}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              showAll={showAllCategories}
            />
          )}
        </div>
      </section>
  )
}

export default BrowseCategories