"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star, Clock, Truck, Tag, Calendar } from "lucide-react";
import { type Item } from "@/types/items";
import { cn } from "@/utils/ui";

interface ProductInfoProps {
  product: Item;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDeliveryModeLabel = (mode: string) => {
    switch (mode) {
      case 'pickup': return 'Pickup Only';
      case 'delivery': return 'Delivery Available';
      case 'both': return 'Pickup & Delivery';
      default: return 'Contact Owner';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800 border-green-200';
      case 'like_new': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Product Title and Basic Info */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 text-slate-600">
              {product.category && (
                <span className="text-sm font-medium">{product.category.categoryName}</span>
              )}
              {product.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {product.location.city}, {product.location.state}
                </div>
              )}
            </div>
          </div>
          
          {/* Rating */}
          {product.ratingAverage > 0 && (
            <div className="bg-white rounded-lg border px-3 py-2 flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
              <span className="font-medium">{product.ratingAverage.toFixed(1)}</span>
              <span className="text-slate-500 text-sm ml-1">
                ({product.ratingCount} {product.ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {/* Key Attributes */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className={cn("border", getConditionColor(product.condition))}>
            {product.condition.replace('_', ' ')}
          </Badge>
          
          {product.isNegotiable && (
            <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
              Negotiable
            </Badge>
          )}
          
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
            <Truck className="w-3 h-3 mr-1" />
            {getDeliveryModeLabel(product.deliveryMode)}
          </Badge>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rental Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Rental Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Minimum Rental</label>
              <p className="text-lg font-semibold text-slate-900">
                {product.minRentalDays} {product.minRentalDays === 1 ? 'day' : 'days'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Maximum Rental</label>
              <p className="text-lg font-semibold text-slate-900">
                {product.maxRentalDays} {product.maxRentalDays === 1 ? 'day' : 'days'}
              </p>
            </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Security Deposit</label>
                <p className="text-lg font-semibold text-slate-900 flex items-center">
                  {/* <Shield className="w-4 h-4 mr-1 text-green-600" /> */}
                  ₹{product.securityAmount?.toLocaleString()}
                </p>
              </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Listed On</label>
              <p className="text-lg font-semibold text-slate-900 flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-slate-600" />
                {formatDate(product.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}