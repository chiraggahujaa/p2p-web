"use client";

import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permission: 'granted' | 'denied' | 'prompt' | null;
}

export function useBrowserLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    permission: null,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        loading: false,
      }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
          permission: 'granted',
        });
      },
      (error) => {
        let errorMessage = 'Location access denied';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setLocation({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false,
          permission: 'denied',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Check permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocation(prev => ({ ...prev, permission: result.state }));
        
        // If already granted, get location automatically
        if (result.state === 'granted') {
          requestLocation();
        }
      }).catch(() => {
        // Fallback if permissions API is not available
        setLocation(prev => ({ ...prev, permission: 'prompt' }));
      });
    }
  }, []);

  return {
    ...location,
    requestLocation,
    hasLocation: location.latitude !== null && location.longitude !== null,
    isAvailable: typeof window !== 'undefined' && 'geolocation' in navigator,
  };
}