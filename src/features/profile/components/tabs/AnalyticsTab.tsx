'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { analyticsAPI } from '@/lib/api/analytics';
import { AnalyticsTabProps } from '../../types/analytics';
import type { AnalyticsDateRange } from '@/types/analytics';
import { AnalyticsOverview } from '../analytics/AnalyticsOverview';
import { AnalyticsCharts } from '../analytics/AnalyticsCharts';
import { ItemPerformanceTable } from '../analytics/ItemPerformanceTable';
import { TimePeriodSelector } from '../analytics/TimePeriodSelector';
import { AnalyticsInsights } from '../analytics/AnalyticsInsights';

export function AnalyticsTab({ userId, isOwnProfile }: AnalyticsTabProps) {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>({
    period: '30d'
  });

  // Fetch user analytics data
  const { data: analyticsRes, isLoading: analyticsLoading } = useQuery({
    queryKey: ['user-analytics', userId, dateRange],
    queryFn: () => analyticsAPI.getUserAnalytics(userId, dateRange),
    enabled: isOwnProfile,
  });

  // Fetch items dashboard data
  const { data: itemsDashboardRes, isLoading: itemsLoading } = useQuery({
    queryKey: ['user-items-dashboard', userId, dateRange.period],
    queryFn: () => {
      const days = dateRange.period === '7d' ? 7 : 
                   dateRange.period === '30d' ? 30 : 
                   dateRange.period === '90d' ? 90 : 30;
      return analyticsAPI.getUserItemsDashboard(userId, days);
    },
    enabled: isOwnProfile,
  });

  // Fetch analytics insights
  const { data: insightsRes, isLoading: insightsLoading } = useQuery({
    queryKey: ['analytics-insights', userId],
    queryFn: () => analyticsAPI.getAnalyticsInsights(userId),
    enabled: isOwnProfile,
  });

  // Show access denied for public profiles
  if (!isOwnProfile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Private</h3>
            <p className="text-muted-foreground">
              Analytics data is only available to the profile owner.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const analyticsData = analyticsRes?.data;
  const itemsData = itemsDashboardRes?.data || [];
  const insightsData = insightsRes?.data;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Analytics</h2>
          <p className="text-muted-foreground">
            Track your performance and earnings
          </p>
        </div>
        <TimePeriodSelector 
          value={dateRange} 
          onChange={setDateRange} 
        />
      </div>

      <Separator />

      {/* Overview Cards */}
      {analyticsLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      ) : analyticsData ? (
        <AnalyticsOverview 
          data={analyticsData} 
          isLoading={analyticsLoading}
          dateRange={dateRange}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">No analytics data available yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start listing items to see your performance metrics.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      {analyticsData && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>
              View your views, bookings, and earnings over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsCharts 
              userId={userId} 
              dateRange={dateRange}
              isLoading={analyticsLoading}
            />
          </CardContent>
        </Card>
      )}

      {/* Items Performance Table */}
      {itemsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Item Performance</CardTitle>
            <CardDescription>
              Detailed performance metrics for your listed items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ItemPerformanceTable 
              items={itemsData} 
              isLoading={itemsLoading}
            />
          </CardContent>
        </Card>
      )}

      {/* Insights and Recommendations */}
      {insightsData && (
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
            <CardDescription>
              AI-powered insights to improve your performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsInsights 
              insights={insightsData?.insights || []}
              recommendations={insightsData?.recommendations || []}
              isLoading={insightsLoading}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}