"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { LocationCard } from '@/components/forms/LocationCard';
import { useCreateAndAddLocation, useAddLocationToUser } from '@/hooks/useUserLocations';
import { addLocationSchema, createAndAddLocationSchema, type AddLocationFormData, type CreateAndAddLocationFormData } from '@/lib/validations/location';


interface AddLocationDialogProps {
  onClose: () => void;
}

export function AddLocationDialog({ onClose }: AddLocationDialogProps) {
  const [activeTab, setActiveTab] = useState('create');
  
  const addLocationMutation = useAddLocationToUser();
  const createLocationMutation = useCreateAndAddLocation();

  // Form for adding existing location
  const addForm = useForm<AddLocationFormData>({
    resolver: zodResolver(addLocationSchema),
    defaultValues: {
      label: 'Location',
      isDefault: false,
    },
    mode: 'onChange',
  });

  // Form for creating new location
  const createForm = useForm<CreateAndAddLocationFormData>({
    resolver: zodResolver(createAndAddLocationSchema),
    defaultValues: {
      location: {
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
      },
      label: 'Location',
      isDefault: false,
    },
    mode: 'onChange',
  });

  const onSubmitAdd = async (data: AddLocationFormData) => {
    try {
      await addLocationMutation.mutateAsync({
        locationId: data.locationId,
        label: data.label,
        isDefault: data.isDefault,
      });
      onClose();
    } catch {
      // Error handled by mutation hook
    }
  };

  const onSubmitCreate = async (data: CreateAndAddLocationFormData) => {
    try {
      await createLocationMutation.mutateAsync({
        location: data.location,
        label: data.label,
        isDefault: data.isDefault,
      });
      onClose();
    } catch {
      // Error handled by mutation hook
    }
  };

  const isPending = addLocationMutation.isPending || createLocationMutation.isPending;

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Location</DialogTitle>
        <DialogDescription>
          Add a location to your address book for faster product listings.
        </DialogDescription>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="existing">Add Existing</TabsTrigger>
        </TabsList>

        {/* Create New Location Tab */}
        <TabsContent value="create" className="mt-6">
          <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-6">
            <LocationCard
              title="New Location Details"
              description="Enter the details for your new location"
              setValue={createForm.setValue}
              watch={createForm.watch}
              errors={createForm.formState.errors}
              locationFieldName="location"
              required={true}
            />

            {/* Label and Default Settings */}
            <div className="space-y-4 p-4 border rounded-md bg-muted/25">
              <h4 className="font-medium">Location Settings</h4>
              
              <div className="space-y-2">
                <Label htmlFor="create-label">Label *</Label>
                <Input
                  id="create-label"
                  placeholder="e.g., Home, Office, Store"
                  {...createForm.register('label')}
                />
                {createForm.formState.errors.label && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.label.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="create-default">Make Default Location</Label>
                  <p className="text-sm text-muted-foreground">
                    Use this location as your default for new product listings
                  </p>
                </div>
                <Switch
                  id="create-default"
                  checked={createForm.watch('isDefault')}
                  onCheckedChange={(checked) => createForm.setValue('isDefault', checked)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!createForm.formState.isValid || isPending}
              >
                {createLocationMutation.isPending ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  'Create & Add Location'
                )}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Add Existing Location Tab */}
        <TabsContent value="existing" className="mt-6">
          <form onSubmit={addForm.handleSubmit(onSubmitAdd)} className="space-y-6">
            <div className="p-4 border rounded-md bg-muted/25">
              <h4 className="font-medium mb-4">Add Existing Location</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="locationId">Select Location *</Label>
                  <Input
                    id="locationId"
                    placeholder="Location ID (UUID)"
                    {...addForm.register('locationId')}
                  />
                  {addForm.formState.errors.locationId && (
                    <p className="text-sm text-destructive">
                      {addForm.formState.errors.locationId.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter the ID of an existing location to add it to your address book.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-label">Label *</Label>
                  <Input
                    id="add-label"
                    placeholder="e.g., Home, Office, Store"
                    {...addForm.register('label')}
                  />
                  {addForm.formState.errors.label && (
                    <p className="text-sm text-destructive">
                      {addForm.formState.errors.label.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="add-default">Make Default Location</Label>
                    <p className="text-sm text-muted-foreground">
                      Use this location as your default for new product listings
                    </p>
                  </div>
                  <Switch
                    id="add-default"
                    checked={addForm.watch('isDefault')}
                    onCheckedChange={(checked) => addForm.setValue('isDefault', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!addForm.formState.isValid || isPending}
              >
                {addLocationMutation.isPending ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Adding...
                  </>
                ) : (
                  'Add Location'
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}