"use client";

import { useState } from "react";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CreateProductFormData, EditProductFormData } from "../../validation/productFormSchema";

interface ProductTagsSectionProps {
  watch: UseFormWatch<CreateProductFormData | EditProductFormData>;
  setValue: UseFormSetValue<CreateProductFormData | EditProductFormData>;
  mode: 'create' | 'edit';
}

export function ProductTagsSection({ 
  watch, 
  setValue,
  mode 
}: ProductTagsSectionProps) {
  const [tagInput, setTagInput] = useState("");
  const watchedTags = watch("tags");

  const addTag = () => {
    if (tagInput.trim() && watchedTags && !watchedTags.includes(tagInput.trim())) {
      const newTags = [...watchedTags, tagInput.trim()];
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (watchedTags) {
      const newTags = watchedTags.filter((tag: string) => tag !== tagToRemove);
      setValue("tags", newTags);
    }
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? "Add tags to help users find your product"
            : "Update tags to help users find your product"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyPress}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>

        {watchedTags && watchedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {watchedTags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="pl-2 pr-1">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}