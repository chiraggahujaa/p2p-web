'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { 
  Eye, 
  Calendar, 
  DollarSign, 
  Star, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { ItemPerformanceTableProps } from '../../types/analytics';
import { cn } from '@/utils/ui';

type SortField = 'views' | 'bookings' | 'earnings' | 'conversionRate' | 'rating';
type SortOrder = 'asc' | 'desc';

export function ItemPerformanceTable({ 
  items, 
  isLoading, 
  onItemClick 
}: ItemPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>('earnings');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (sortOrder === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const SortableHeader = ({ 
    field, 
    children, 
    className 
  }: { 
    field: SortField; 
    children: React.ReactNode; 
    className?: string;
  }) => (
    <TableHead className={cn('cursor-pointer hover:bg-muted/50', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSort(field)}
        className="h-auto p-0 font-semibold justify-start w-full"
      >
        {children}
        <ArrowUpDown className="ml-2 h-3 w-3" />
        {sortField === field && (
          sortOrder === 'asc' ? 
            <TrendingUp className="ml-1 h-3 w-3" /> : 
            <TrendingDown className="ml-1 h-3 w-3" />
        )}
      </Button>
    </TableHead>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No items found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Start listing items to see performance data
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {items.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {items.reduce((sum, item) => sum + item.bookings, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Bookings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(items.reduce((sum, item) => sum + item.earnings, 0))}
          </div>
          <div className="text-xs text-muted-foreground">Total Earnings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {(items.reduce((sum, item) => sum + item.rating, 0) / items.length || 0).toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground">Avg Rating</div>
        </div>
      </div>

      {/* Items Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Item</TableHead>
              <TableHead>Title</TableHead>
              <SortableHeader field="views">Views</SortableHeader>
              <SortableHeader field="bookings">Bookings</SortableHeader>
              <SortableHeader field="earnings">Earnings</SortableHeader>
              <SortableHeader field="conversionRate" className="hidden sm:table-cell">
                Conversion
              </SortableHeader>
              <SortableHeader field="rating" className="hidden md:table-cell">
                Rating
              </SortableHeader>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item) => (
              <TableRow 
                key={item.itemId}
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => onItemClick?.(item.itemId)}
              >
                <TableCell>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <span className="text-xs font-medium text-primary">
                          {item.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium line-clamp-1">{item.title}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span>{item.views.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{item.bookings}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span>{formatCurrency(item.earnings)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="font-medium">
                    {(item.conversionRate).toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}