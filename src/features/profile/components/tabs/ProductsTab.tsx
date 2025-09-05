'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

export function ProductsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Product Listing</h2>
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Product listing section coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}