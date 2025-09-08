'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb, 
  ExternalLink,
  Target,
  Award
} from 'lucide-react';
import { AnalyticsInsightsProps } from '../../types/analytics';
import { cn } from '@/utils/ui';

export function AnalyticsInsights({ 
  insights, 
  recommendations, 
  isLoading 
}: AnalyticsInsightsProps) {
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-blue-600" />;
      default:
        return <TrendingUp className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightBadgeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'suggestion':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  // Mock data if no insights provided
  const defaultInsights = insights.length > 0 ? insights : [
    {
      type: 'positive' as const,
      title: 'Strong Performance',
      description: 'Your items have a 15% higher view-to-booking conversion rate than average',
      value: '15%'
    },
    {
      type: 'suggestion' as const,
      title: 'Pricing Opportunity',
      description: 'Consider adjusting prices for 3 items that are underperforming',
      actionable: true
    }
  ];

  const defaultRecommendations = recommendations.length > 0 ? recommendations : [
    {
      title: 'Optimize Photo Quality',
      description: 'Items with high-quality photos get 40% more views. Consider updating images for your top 5 items.',
      actionable: true,
      priority: 'high' as const
    },
    {
      title: 'Add More Details',
      description: 'Items with detailed descriptions have better conversion rates. Update 7 items with brief descriptions.',
      actionable: true,
      priority: 'medium' as const
    },
    {
      title: 'Weekend Promotions',
      description: 'Your bookings increase 25% on weekends. Consider weekend-specific pricing strategies.',
      actionable: false,
      priority: 'low' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      {defaultInsights.length > 0 && (
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Key Insights
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {defaultInsights.map((insight, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium">{insight.title}</h5>
                        <Badge 
                          variant="outline" 
                          className={cn('text-xs', getInsightBadgeColor(insight.type))}
                        >
                          {insight.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {insight.description}
                      </p>
                      {insight.value && (
                        <div className="text-lg font-bold text-primary">
                          {insight.value}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {defaultRecommendations.length > 0 && (
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Recommendations
          </h4>
          <div className="space-y-3">
            {defaultRecommendations.map((rec, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium">{rec.title}</h5>
                        <Badge 
                          variant="outline"
                          className={cn('text-xs', getPriorityColor(rec.priority))}
                        >
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
                    </div>
                    {rec.actionable && (
                      <Button size="sm" variant="outline" className="gap-2">
                        <ExternalLink className="h-3 w-3" />
                        Take Action
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p>Update your item photos regularly to keep listings fresh and engaging</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p>Respond to inquiries within 2 hours to improve booking rates</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p>Offer competitive pricing during peak demand periods</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}