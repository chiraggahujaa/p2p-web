'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analyticsAPI } from '@/lib/api/analytics';
import { AnalyticsChartsProps } from '../../types/analytics';

type ChartType = 'views' | 'bookings' | 'earnings';

export function AnalyticsCharts({ userId, dateRange, isLoading }: AnalyticsChartsProps) {
  const [activeChart, setActiveChart] = useState<ChartType>('views');

  // Mock data for demonstration - in real implementation, fetch from backend
  const { data: earningsRes, isLoading: earningsLoading } = useQuery({
    queryKey: ['earnings-breakdown', userId, dateRange],
    queryFn: () => analyticsAPI.getEarningsBreakdown(userId, dateRange),
    enabled: !!userId,
  });

  // Sample chart data - replace with real data from backend
  const viewsData = [
    { date: '2024-01-01', value: 45, label: 'Jan 1' },
    { date: '2024-01-02', value: 52, label: 'Jan 2' },
    { date: '2024-01-03', value: 38, label: 'Jan 3' },
    { date: '2024-01-04', value: 63, label: 'Jan 4' },
    { date: '2024-01-05', value: 71, label: 'Jan 5' },
    { date: '2024-01-06', value: 55, label: 'Jan 6' },
    { date: '2024-01-07', value: 89, label: 'Jan 7' },
  ];

  const bookingsData = [
    { date: '2024-01-01', value: 3, label: 'Jan 1' },
    { date: '2024-01-02', value: 5, label: 'Jan 2' },
    { date: '2024-01-03', value: 2, label: 'Jan 3' },
    { date: '2024-01-04', value: 8, label: 'Jan 4' },
    { date: '2024-01-05', value: 6, label: 'Jan 5' },
    { date: '2024-01-06', value: 4, label: 'Jan 6' },
    { date: '2024-01-07', value: 7, label: 'Jan 7' },
  ];

  const earningsData = earningsRes?.data?.monthlyBreakdown || [
    { month: 'Jan', earnings: 2500, bookings: 15 },
    { month: 'Feb', earnings: 3200, bookings: 18 },
    { month: 'Mar', earnings: 2800, bookings: 16 },
    { month: 'Apr', earnings: 4100, bookings: 22 },
    { month: 'May', earnings: 3500, bookings: 20 },
    { month: 'Jun', earnings: 4500, bookings: 25 },
  ];

  // Conversion funnel data
  const conversionData = [
    { name: 'Views', value: 1234, color: '#3b82f6' },
    { name: 'Inquiries', value: 234, color: '#10b981' },
    { name: 'Bookings', value: 89, color: '#f59e0b' },
    { name: 'Completed', value: 67, color: '#ef4444' },
  ];

  const chartButtons = [
    { key: 'views' as ChartType, label: 'Views Trend', color: 'bg-blue-500' },
    { key: 'bookings' as ChartType, label: 'Bookings', color: 'bg-green-500' },
    { key: 'earnings' as ChartType, label: 'Earnings', color: 'bg-orange-500' },
  ];

  const renderChart = () => {
    if (isLoading || earningsLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      );
    }

    switch (activeChart) {
      case 'views':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="label" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bookings':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="label" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'earnings':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [
                  new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  }).format(value),
                  'Earnings'
                ]}
              />
              <Bar 
                dataKey="earnings" 
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2">
        {chartButtons.map(({ key, label, color }) => (
          <Button
            key={key}
            variant={activeChart === key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChart(key)}
            className="gap-2"
          >
            <div className={`w-3 h-3 rounded-full ${color}`} />
            {label}
          </Button>
        ))}
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">
            {activeChart === 'views' && 'Daily Views'}
            {activeChart === 'bookings' && 'Daily Bookings'}
            {activeChart === 'earnings' && 'Monthly Earnings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionData.map((item, index) => {
                const percentage = index === 0 ? 100 : 
                  ((item.value / conversionData[0].value) * 100).toFixed(1);
                
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.value.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}