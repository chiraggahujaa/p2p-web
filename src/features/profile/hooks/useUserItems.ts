import { useQuery } from '@tanstack/react-query';
import { itemsAPI } from '@/lib/api/items';

export const useUserItems = (userId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['userItems', userId, page, limit],
    queryFn: () => itemsAPI.getByUserId(userId, page, limit),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};