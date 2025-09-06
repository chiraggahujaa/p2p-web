"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/ui";

interface ProductImage {
  file: {
    url: string;
  };
  isPrimary: boolean;
  displayOrder: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Sort images by display order, with primary first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.displayOrder - b.displayOrder;
  });

  const currentImage = sortedImages[selectedImageIndex];

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => 
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
        <p className="text-slate-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden group">
        <Image
          src={currentImage.file.url}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Navigation Arrows */}
        {sortedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {sortedImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {selectedImageIndex + 1} / {sortedImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                index === selectedImageIndex 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-slate-200 hover:border-slate-300"
              )}
              onClick={() => setSelectedImageIndex(index)}
            >
              <Image
                src={image.file.url}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}