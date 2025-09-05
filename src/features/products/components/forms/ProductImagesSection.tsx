"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { type UploadedFile } from "@/types/items";
import { toast } from "sonner";

interface ProductImagesSectionProps {
  uploadedImages: UploadedFile[];
  setUploadedImages: (files: UploadedFile[]) => void;
  mode: 'create' | 'edit';
}

export function ProductImagesSection({ 
  uploadedImages, 
  setUploadedImages,
  mode 
}: ProductImagesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? "Upload high-quality images of your product"
            : "Update product images"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ImageUpload
          maxFiles={5}
          maxSizeBytes={5 * 1024 * 1024} // 5MB
          onFilesChange={setUploadedImages}
          existingFiles={uploadedImages}
          onUploadError={(error) => toast.error(error)}
          filePath="products"
        />
      </CardContent>
    </Card>
  );
}