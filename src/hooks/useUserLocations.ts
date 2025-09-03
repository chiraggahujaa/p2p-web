"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userLocationsAPI } from '@/lib/api/userLocations';
import {
  UpdateUserLocationDto, 
} from '@/types/userLocation';

// Hooks
export function useUserLocations(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['userLocations', page, limit],
    queryFn: () => userLocationsAPI.getUserLocations(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}


export function useAddLocationToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLocationsAPI.addLocationToUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLocations'] });
      toast.success('Location added to your address book');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add location');
    },
  });
}

export function useCreateAndAddLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLocationsAPI.createAndAddLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLocations'] });
      toast.success('Location created and added to your address book');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create and add location');
    },
  });
}

export function useUpdateUserLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userLocationId, data }: { userLocationId: string; data: UpdateUserLocationDto }) => 
      userLocationsAPI.updateUserLocation(userLocationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLocations'] });
      toast.success('Location updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update location');
    },
  });
}

export function useRemoveUserLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLocationsAPI.removeUserLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLocations'] });
      toast.success('Location removed from your address book');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove location');
    },
  });
}