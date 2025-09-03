import { useQuery } from "@tanstack/react-query";
import { categoriesAPI } from "@/lib/api/categories";
import { itemsAPI } from "@/lib/api/items";

export const useHomeData = (selectedCategory: string, currentPage: number, itemsPerPage: number) => {
  const { data: popularCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", "popular"],
    queryFn: categoriesAPI.getPopular,
  });

  const { data: allCategories, isLoading: allCategoriesLoading } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoriesAPI.getAll,
  });

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

  return {
    popularCategories,
    categoriesLoading,
    allCategories,
    allCategoriesLoading,
    itemsResponse,
    itemsLoading,
  };
};
