'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Eye, Calendar, DollarSign, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnalyticsOverviewProps, AnalyticsMetricCard } from '../../types/analytics';
import { cn } from '@/utils/ui';

export function AnalyticsOverview({ data, isLoading, dateRange }: AnalyticsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-center">
                <LoadingSpinner className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatValue = (value: number | string, format: AnalyticsMetricCard['format']): string => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'rating':
        return value.toFixed(1);
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  const getPeriodText = () => {
    switch (dateRange.period) {
      case '7d': return 'vs last 7 days';
      case '30d': return 'vs last 30 days';
      case '90d': return 'vs last 90 days';
      default: return 'vs previous period';
    }
  };

  const metrics: AnalyticsMetricCard[] = [
    {
      title: 'Total Views',
      value: data.totalViews,
      format: 'number',
      icon: Eye,
      change: {
        value: 12.5,
        direction: 'up',
        period: getPeriodText(),
      },
    },
    {
      title: 'Total Bookings',
      value: data.totalBookings,
      format: 'number',
      icon: Calendar,
      change: {
        value: 8.2,
        direction: 'up',
        period: getPeriodText(),
      },
    },
    {
      title: 'Total Earnings',
      value: data.totalEarnings,
      format: 'currency',
      icon: DollarSign,
      change: {
        value: 15.7,
        direction: 'up',
        period: getPeriodText(),
      },
    },
    {
      title: 'Average Rating',
      value: data.averageRating,
      format: 'rating',
      icon: Star,
      change: {
        value: 0.2,
        direction: 'up',
        period: getPeriodText(),
      },
    },
  ];

  const renderChangeIndicator = (change: AnalyticsMetricCard['change']) => {
    if (!change) return null;

    const IconComponent = change.direction === 'up' ? TrendingUp : 
                         change.direction === 'down' ? TrendingDown : Minus;
    
    const colorClass = change.direction === 'up' ? 'text-green-600' : 
                       change.direction === 'down' ? 'text-red-600' : 'text-gray-600';

    return (
      <div className={cn('flex items-center gap-1 text-sm', colorClass)}>
        <IconComponent className="h-4 w-4" />
        <span className="font-medium">
          {change.direction === 'neutral' ? '0' : change.value > 0 ? '+' : ''}{change.value}%
        </span>
        <span className="text-xs text-muted-foreground">
          {change.period}
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon || Eye;
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-2xl font-bold">
                  {formatValue(metric.value, metric.format)}
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-1">
                  {metric.title}
                </div>
                
                {metric.change && (
                  <div className="mt-2">
                    {renderChangeIndicator(metric.change)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}