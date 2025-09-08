'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/utils/ui';
import { TimePeriodSelectorProps, TimePeriodOption } from '../../types/analytics';

export function TimePeriodSelector({ value, onChange, options }: TimePeriodSelectorProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const defaultOptions: TimePeriodOption[] = [
    { label: 'Last 7 days', value: '7d', days: 7 },
    { label: 'Last 30 days', value: '30d', days: 30 },
    { label: 'Last 90 days', value: '90d', days: 90 },
    { label: 'Custom', value: 'custom' },
  ];

  const availableOptions = options || defaultOptions;
  const selectedOption = availableOptions.find(option => option.value === value.period);

  const handlePeriodSelect = (periodValue: TimePeriodOption['value']) => {
    if (periodValue === 'custom') {
      setShowCustom(true);
      return;
    }

    const selectedOpt = availableOptions.find(opt => opt.value === periodValue);
    if (selectedOpt?.days) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - selectedOpt.days);

      onChange({
        period: periodValue,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });
    } else {
      onChange({ period: periodValue });
    }
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      onChange({
        period: 'custom',
        startDate: customStartDate,
        endDate: customEndDate,
      });
      setShowCustom(false);
    }
  };

  const getDisplayText = () => {
    if (value.period === 'custom' && value.startDate && value.endDate) {
      const startDate = new Date(value.startDate).toLocaleDateString();
      const endDate = new Date(value.endDate).toLocaleDateString();
      return `${startDate} - ${endDate}`;
    }
    return selectedOption?.label || 'Select Period';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          {getDisplayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium leading-none mb-3">Select Time Period</h4>
            <div className="grid gap-2">
              {availableOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={value.period === option.value ? "default" : "ghost"}
                  className={cn(
                    "justify-start",
                    value.period === option.value && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handlePeriodSelect(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {showCustom && (
            <div className="space-y-4 border-t pt-4">
              <h5 className="font-medium">Custom Date Range</h5>
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleCustomDateApply}
                  disabled={!customStartDate || !customEndDate}
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCustom(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}