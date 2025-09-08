import api from "./axios";
import { ApiResponse } from "@/types/api";
import type {
  AnalyticsEvent,
  ItemMetrics,
  ItemAnalyticsSummary,
  UserAnalyticsSummary,
  ItemPerformance,
  AnalyticsDateRange,
  EarningsBreakdownData,
  AnalyticsInsightsResponse
} from "@/types/analytics";

export const analyticsAPI = {
  // Get user's overall analytics summary
  getUserAnalytics: async (
    userId: string,
    dateRange?: AnalyticsDateRange
  ): Promise<ApiResponse<UserAnalyticsSummary>> => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    if (dateRange?.period) params.append('period', dateRange.period);

    const response = await api.get(`/api/analytics/user/${userId}?${params.toString()}`);
    return response.data;
  },

  // Get analytics for all user's items (dashboard view)
  getUserItemsDashboard: async (
    userId: string,
    days: number = 30
  ): Promise<ApiResponse<ItemPerformance[]>> => {
    const response = await api.get(`/api/analytics/user/${userId}/items-dashboard?days=${days}`);
    return response.data;
  },

  // Get detailed analytics for a specific item
  getItemAnalytics: async (
    itemId: string,
    dateRange?: AnalyticsDateRange
  ): Promise<ApiResponse<ItemAnalyticsSummary & {
    totalEarnings: number;
    averageRating: number;
    totalReviews: number;
  }>> => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

    const response = await api.get(`/api/items/${itemId}/analytics?${params.toString()}`);
    return response.data;
  },

  // Get item metrics over time (for charts)
  getItemMetrics: async (
    itemId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<ItemMetrics[]>> => {
    const response = await api.get(
      `/api/analytics/items/${itemId}/metrics?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  // Get user's top performing items
  getTopPerformingItems: async (
    userId: string,
    limit: number = 5,
    metric: 'views' | 'bookings' | 'earnings' | 'rating' = 'earnings'
  ): Promise<ApiResponse<ItemPerformance[]>> => {
    const response = await api.get(
      `/api/analytics/user/${userId}/top-items?limit=${limit}&metric=${metric}`
    );
    return response.data;
  },

  // Get analytics insights and recommendations
  getAnalyticsInsights: async (
    userId: string
  ): Promise<ApiResponse<AnalyticsInsightsResponse>> => {
    const response = await api.get(`/api/analytics/user/${userId}/insights`);
    return response.data;
  },

  // Record analytics event (if needed for client-side tracking)
  recordEvent: async (eventData: {
    eventType: string;
    itemId?: string;
    additionalData?: Record<string, unknown>;
  }): Promise<ApiResponse<AnalyticsEvent>> => {
    const response = await api.post('/api/analytics/events', eventData);
    return response.data;
  },

  // Get earnings breakdown
  getEarningsBreakdown: async (
    userId: string,
    dateRange?: AnalyticsDateRange
  ): Promise<ApiResponse<EarningsBreakdownData>> => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    if (dateRange?.period) params.append('period', dateRange.period);

    const response = await api.get(`/api/analytics/user/${userId}/earnings?${params.toString()}`);
    return response.data;
  },
};