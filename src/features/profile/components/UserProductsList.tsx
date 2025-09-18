"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/ui/pagination";
import { ItemConditionTag } from "@/components/ui/item-condition-tag";
import {
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Calendar,
  Star,
  Package,
} from "lucide-react";
import { Item } from "@/types/items";
import { itemsAPI } from "@/lib/api/items";
import { useUserItems } from "../hooks/useUserItems";
import { toast } from "sonner";

interface UserProductsListProps {
  userId: string;
  isOwnProfile: boolean;
}

export function UserProductsList({ userId, isOwnProfile }: UserProductsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useUserItems(userId, currentPage, itemsPerPage);

  const deleteItemMutation = useMutation({
    mutationFn: itemsAPI.delete,
    onSuccess: () => {
      toast.success("Item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['userItems', userId] });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : "Failed to delete item";
      toast.error(errorMessage || "Failed to delete item");
    },
  });

  const handleView = (itemId: string) => {
    router.push(`/products/${itemId}`);
  };

  const handleEdit = (itemId: string) => {
    router.push(`/products/edit/${itemId}`);
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unavailable':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner className="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load items. Please try again.
      </div>
    );
  }

  if (!data?.data?.data.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No items listed</p>
        <p className="text-sm">
          {isOwnProfile 
            ? "Start sharing your items with the community!"
            : "This user hasn't listed any items yet."}
        </p>
        {isOwnProfile && (
          <Button
            onClick={() => router.push("/products/add")}
            className="mt-4"
          >
            List Your First Item
          </Button>
        )}
      </div>
    );
  }

  return (
    <div id="products-list" className="space-y-4">
      {data.data.data.map((item: Item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex gap-4 p-4">
              {/* Product Image */}
              <div className="flex-shrink-0 self-start">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                  {item.images?.[0]?.file?.url ? (
                    <Image
                      src={item.images[0].file.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>
                  
                  {isOwnProfile && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(item.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600"
                          disabled={deleteItemMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Status and Condition */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={getStatusColor(item.status)}
                  >
                    {item.status.replace('_', ' ')}
                  </Badge>
                  <ItemConditionTag condition={item.condition} />
                  {item.category && (
                    <Badge variant="outline">
                      {item.category.categoryName}
                    </Badge>
                  )}
                </div>

                {/* Details Row */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">
                      ₹{item.rentPricePerDay}
                    </span>
                    <span>/day</span>
                  </div>
                  
                  {item.ratingAverage > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{item.ratingAverage.toFixed(1)}</span>
                      <span className="text-xs">
                        ({item.ratingCount} review{item.ratingCount !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}

                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location.city}, {item.location.state}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Rental Duration */}
                <div className="text-xs text-muted-foreground">
                  Min {item.minRentalDays} day{item.minRentalDays !== 1 ? 's' : ''} - 
                  Max {item.maxRentalDays} day{item.maxRentalDays !== 1 ? 's' : ''}
                  {item.isNegotiable && (
                    <span className="ml-2 text-green-600">• Negotiable</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {data.data.pagination.total > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={data.data.pagination.total}
          itemsPerPageOptions={[5, 10, 20, 50]}
          defaultItemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          className="mt-6"
          scrollTarget="element"
          scrollElementId="products-list"
        />
      )}
    </div>
  );
}