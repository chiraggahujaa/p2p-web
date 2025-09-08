// Analytics types for profile analytics feature

export interface AnalyticsDateRange {
  startDate?: string;
  endDate?: string;
  period?: '7d' | '30d' | '90d' | 'custom';
}

export interface AnalyticsMetricCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  format: 'number' | 'currency' | 'percentage' | 'rating';
}

export interface AnalyticsChartData {
  date: string;
  value: number;
  label?: string;
}

export interface AnalyticsInsight {
  type: 'positive' | 'neutral' | 'suggestion' | 'warning';
  title: string;
  description: string;
  value?: string | number;
  actionable?: boolean;
}

export interface AnalyticsRecommendation {
  title: string;
  description: string;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ItemPerformanceRow {
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

export interface AnalyticsOverviewData {
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

export interface AnalyticsChartConfig {
  type: 'line' | 'bar' | 'area' | 'donut' | 'pie';
  data: AnalyticsChartData[];
  title: string;
  subtitle?: string;
  xAxisKey: string;
  yAxisKey: string;
  color: string;
  height?: number;
}

export interface TimePeriodOption {
  label: string;
  value: '7d' | '30d' | '90d' | 'custom';
  days?: number;
}

export interface AnalyticsFilters {
  dateRange: AnalyticsDateRange;
  itemStatus?: 'all' | 'active' | 'inactive';
  sortBy?: 'views' | 'bookings' | 'earnings' | 'rating' | 'date';
  sortOrder?: 'asc' | 'desc';
}

// Component props interfaces
export interface AnalyticsTabProps {
  userId: string;
  isOwnProfile: boolean;
}

export interface AnalyticsOverviewProps {
  data: AnalyticsOverviewData;
  isLoading: boolean;
  dateRange: AnalyticsDateRange;
}

export interface AnalyticsChartsProps {
  userId: string;
  dateRange: AnalyticsDateRange;
  isLoading: boolean;
}

export interface ItemPerformanceTableProps {
  items: ItemPerformanceRow[];
  isLoading: boolean;
  onItemClick?: (itemId: string) => void;
}

export interface TimePeriodSelectorProps {
  value: AnalyticsDateRange;
  onChange: (dateRange: AnalyticsDateRange) => void;
  options?: TimePeriodOption[];
}

export interface AnalyticsInsightsProps {
  insights: AnalyticsInsight[];
  recommendations: AnalyticsRecommendation[];
  isLoading: boolean;
}

// API response types (re-exported from types for convenience)
export type {
  AnalyticsEvent,
  ItemMetrics,
  ItemAnalyticsSummary,
  UserAnalyticsSummary,
  ItemPerformance
} from '@/types/analytics';