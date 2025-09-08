// Analytics interfaces based on backend types
export interface AnalyticsEvent {
  id: string;
  eventType: string;
  itemId?: string;
  userId?: string;
  sessionId?: string;
  deviceId?: string;
  eventTimestamp: string;
  eventDate: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  additionalData?: Record<string, unknown>;
}

export interface ItemMetrics {
  id: string;
  itemId: string;
  metricDate: string;
  viewCount: number;
  uniqueViewCount: number;
  bookingCount: number;
  bookingConversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
}

export interface ItemAnalyticsSummary {
  totalViews: number;
  uniqueViews: number;
  totalBookings: number;
  conversionRate: number;
  avgDailyViews: number;
  trendDirection: 'up' | 'down' | 'stable' | 'insufficientData';
}

export interface UserAnalyticsSummary {
  totalViews: number;
  totalBookings: number;
  completedBookings: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  conversionRate: number;
  totalItems: number;
  activeItems: number;
}

export interface ItemPerformance {
  itemId: string;
  title: string;
  imageUrl?: string;
  views: number;
  bookings: number;
  earnings: number;
  conversionRate: number;
  rating: number;
  status: 'active' | 'inactive' | 'draft' | 'pending';
  createdAt: string;
}

export interface AnalyticsDateRange {
  startDate?: string;
  endDate?: string;
  period?: '7d' | '30d' | '90d' | 'custom';
}

export interface EarningsBreakdownData {
  totalEarnings: number;
  completedBookings: number;
  pendingEarnings: number;
  monthlyBreakdown: Array<{
    month: string;
    earnings: number;
    bookings: number;
  }>;
  topEarningItems: Array<{
    itemId: string;
    title: string;
    earnings: number;
    bookings: number;
  }>;
}

export interface AnalyticsInsightItem {
  type: 'positive' | 'neutral' | 'suggestion' | 'warning';
  title: string;
  description: string;
  value?: string | number;
  actionable?: boolean;
}

export interface AnalyticsRecommendationItem {
  title: string;
  description: string;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalyticsInsightsResponse {
  insights: AnalyticsInsightItem[];
  recommendations: AnalyticsRecommendationItem[];
}