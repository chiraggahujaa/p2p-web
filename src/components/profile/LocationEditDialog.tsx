"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { LocationCard } from '@/components/forms/LocationCard';
import { useUpdateUserLocation } from '@/hooks/useUserLocations';
import { UserLocationWithDetails } from '@/types/userLocation';
import { editLocationSchema, type EditLocationFormData } from '@/lib/validations/location';


interface LocationEditDialogProps {
  userLocation: UserLocationWithDetails;
  onClose: () => void;
}

export function LocationEditDialog({ userLocation, onClose }: LocationEditDialogProps) {
  const updateLocationMutation = useUpdateUserLocation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<EditLocationFormData>({
    resolver: zodResolver(editLocationSchema),
    defaultValues: {
      location: {
        addressLine: userLocation.location.addressLine,
        city: userLocation.location.city,
        state: userLocation.location.state,
        pincode: userLocation.location.pincode,
        country: userLocation.location.country || 'India',
        latitude: userLocation.location.latitude,
        longitude: userLocation.location.longitude,
      },
      label: userLocation.label,
      isDefault: userLocation.isDefault,
    },
    mode: 'onChange',
  });

  const isDefault = watch('isDefault');

  // Debug: Log form state
  console.log('Form validation state:', { isValid, errors });

  const onSubmit = async (data: EditLocationFormData) => {
    try {
      await updateLocationMutation.mutateAsync({
        userLocationId: userLocation.id,
        data: {
          location: {
            ...data.location,
            latitude: data.location.latitude ?? undefined,
            longitude: data.location.longitude ?? undefined,
          },
          label: data.label,
          isDefault: data.isDefault,
        }
      });
      onClose();
    } catch {
      // Error is handled by the mutation hook
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Update any details of this location including address, label, and default status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Location Details */}
          <LocationCard
            title="Location Details"
            description="Edit the address and location information"
            setValue={setValue}
            watch={watch}
            errors={errors}
            locationFieldName="location"
            required={true}
          />

          {/* Label and Default Settings */}
          <div className="space-y-4 p-4 border rounded-md bg-muted/25">
            <h4 className="font-medium">Location Settings</h4>
            
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                placeholder="e.g., Home, Office, Store"
                {...register('label')}
              />
              {errors.label && (
                <p className="text-sm text-destructive">
                  {errors.label.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isDefault">Default Location</Label>
                <p className="text-sm text-muted-foreground">
                  Use this location as your default for new product listings
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={isDefault}
                onCheckedChange={(checked) => setValue('isDefault', checked)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateLocationMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || updateLocationMutation.isPending}
            >
              {updateLocationMutation.isPending ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}