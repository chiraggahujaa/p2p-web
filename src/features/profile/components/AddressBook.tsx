"use client";

import { useState } from "react";
import { MapPin, Edit2, Trash2, Plus, Star, StarOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  useUserLocations,
  useRemoveUserLocation,
  useUpdateUserLocation,
} from "@/hooks/useUserLocations";
import { UserLocationWithDetails } from "@/types/userLocation";
import { LocationEditDialog } from "./LocationEditDialog";
import { AddLocationDialog } from "./AddLocationDialog";

export function AddressBook() {
  const [editingLocation, setEditingLocation] =
    useState<UserLocationWithDetails | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    data: locationsResponse,
    isLoading,
    error,
    refetch,
  } = useUserLocations();
  const removeLocationMutation = useRemoveUserLocation();
  const updateLocationMutation = useUpdateUserLocation();

  const locations = locationsResponse?.data || [];

  const handleMakeDefault = async (userLocationId: string) => {
    updateLocationMutation.mutate({
      userLocationId,
      data: { isDefault: true },
    });
  };

  const handleDeleteLocation = async (userLocationId: string) => {
    removeLocationMutation.mutate(userLocationId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-destructive">Failed to load your address book</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Address Book</h3>
          <p className="text-sm text-muted-foreground">
            Manage your saved locations for faster product listings
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <AddLocationDialog onClose={() => setIsAddDialogOpen(false)} />
        </Dialog>
      </div>

      {locations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No locations saved</h3>
            <p className="text-muted-foreground mb-4">
              Add your first location to get started
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {locations.map((userLocation) => (
            <Card key={userLocation.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{userLocation.label}</h4>
                        {userLocation.isDefault && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="font-medium text-foreground">
                          {userLocation.location.addressLine}
                        </p>
                        <p>
                          {[
                            userLocation.location.city,
                            userLocation.location.state,
                            userLocation.location.pincode,
                            userLocation.location.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-4">
                    {!userLocation.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMakeDefault(userLocation.id)}
                        disabled={updateLocationMutation.isPending}
                        title="Make default location"
                      >
                        <StarOff className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingLocation(userLocation)}
                      title="Edit location"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete location"
                          disabled={locations.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Location</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove &quot;
                            {userLocation.label}&quot; from your address book?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteLocation(userLocation.id)
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {locations.length === 1 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Note:</span> This is your
                      only location and cannot be deleted. Add another location
                      first if you want to remove this one.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Location Dialog */}
      {editingLocation && (
        <LocationEditDialog
          userLocation={editingLocation}
          onClose={() => setEditingLocation(null)}
        />
      )}
    </div>
  );
}
