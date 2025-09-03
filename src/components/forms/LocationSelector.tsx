"use client";

import { useState, useEffect } from "react";
import { UseFormSetValue, UseFormWatch, FieldErrors, Path, FieldValues } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { CreateLocationDto } from "@/types/location";
import { MapPin, Star, BookmarkPlus, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/utils/ui";
import { useUserLocations, useCreateAndAddLocation } from '@/hooks/useUserLocations';
import { toast } from 'sonner';
import { UserLocationWithDetails } from "@/types/userLocation";

interface LocationSelectorProps<T extends FieldValues> {
  title?: string;
  description?: string;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  errors: FieldErrors<T>;
  locationFieldName: Path<T>;
  required?: boolean;
  className?: string;
  enableAddressBook?: boolean;
}

export function LocationSelector<T extends FieldValues>({
  title = "Location",
  description = "Specify where the product is located",
  setValue,
  watch,
  errors,
  locationFieldName,
  required = true,
  className,
  enableAddressBook = true,
}: LocationSelectorProps<T>) {
  const [useDefault, setUseDefault] = useState(false);
  const [showSavedLocations, setShowSavedLocations] = useState(false);
  const [saveToAddressBook, setSaveToAddressBook] = useState(true);

  const location = watch(locationFieldName) as unknown as CreateLocationDto | null;
  const locationError = errors[locationFieldName as keyof FieldErrors<T>];

  // Hooks for address book integration
  const { data: locationsResponse, isLoading: isLoadingLocations } = useUserLocations(1, 50);
  const createAndAddLocationMutation = useCreateAndAddLocation();

  const savedLocations = locationsResponse?.data || [];
  const defaultLocation = savedLocations.find(loc => loc.isDefault)?.location;

  // Auto-load default location on mount if enabled
  useEffect(() => {
    if (enableAddressBook && defaultLocation && !location && useDefault) {
      const locationData: CreateLocationDto = {
        addressLine: defaultLocation.addressLine,
        city: defaultLocation.city,
        state: defaultLocation.state,
        pincode: defaultLocation.pincode,
        country: defaultLocation.country,
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
      };
      setValue(locationFieldName, locationData as T[Path<T>]);
    }
  }, [defaultLocation, useDefault, location, setValue, locationFieldName, enableAddressBook]);

  const handleDefaultLocationToggle = (checked: boolean) => {
    setUseDefault(checked);
    if (checked && defaultLocation) {
      const locationData: CreateLocationDto = {
        addressLine: defaultLocation.addressLine,
        city: defaultLocation.city,
        state: defaultLocation.state,
        pincode: defaultLocation.pincode,
        country: defaultLocation.country,
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
      };
      setValue(locationFieldName, locationData as T[Path<T>]);
    } else if (!checked) {
      setValue(locationFieldName, null as T[Path<T>]);
    }
  };

  const handleSavedLocationSelect = (savedLocation: UserLocationWithDetails) => {
    const locationData: CreateLocationDto = {
      addressLine: savedLocation.location.addressLine,
      city: savedLocation.location.city,
      state: savedLocation.location.state,
      pincode: savedLocation.location.pincode,
      country: savedLocation.location.country,
      latitude: savedLocation.location.latitude,
      longitude: savedLocation.location.longitude,
    };
    setValue(locationFieldName, locationData as T[Path<T>]);
    setUseDefault(false);
    setShowSavedLocations(false);
  };

  const handleAddressSelect = (address: CreateLocationDto) => {
    setValue(locationFieldName, address as T[Path<T>]);
    setUseDefault(false);
  };

  const updateLocationField = (field: keyof CreateLocationDto, value: string | number) => {
    const currentLocation = location || {
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    };

    const updatedLocation: CreateLocationDto = {
      ...currentLocation,
      [field]: value,
    };

    setValue(locationFieldName, updatedLocation as T[Path<T>]);
    setUseDefault(false);
  };

  const handleSaveToAddressBook = async () => {
    if (!location || !location.addressLine || !location.city || !location.state || !location.pincode) {
      toast.error('Please complete the location details before saving');
      return;
    }

    try {
      await createAndAddLocationMutation.mutateAsync({
        location: location,
        label: `${location.city} Location`,
        isDefault: false,
      });
      setSaveToAddressBook(false);
      toast.success('Location saved to your address book');
    } catch {
      // Error handled by mutation hook
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {enableAddressBook && (
          <>
            {/* Default Location Option */}
            {defaultLocation && (
              <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/25">
                <Checkbox
                  id="use-default"
                  checked={useDefault}
                  onCheckedChange={handleDefaultLocationToggle}
                  disabled={isLoadingLocations}
                />
                <div className="space-y-2 flex-1">
                  <Label htmlFor="use-default" className="font-medium cursor-pointer">
                    Use my default location
                  </Label>
                  {isLoadingLocations ? (
                    <LoadingSpinner className="h-4 w-4" />
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{defaultLocation.addressLine}</span>
                        {/* <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {defaultLocation.label}
                        </Badge> */}
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">
                        {[defaultLocation.city, defaultLocation.state, defaultLocation.pincode, defaultLocation.country]
                          .filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Saved Locations */}
            {savedLocations.length > 0 && !useDefault && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSavedLocations(!showSavedLocations)}
                  className="w-full justify-between"
                  disabled={isLoadingLocations}
                >
                  <span>Choose from saved locations</span>
                  {showSavedLocations ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {showSavedLocations && (
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                    {savedLocations.map((savedLocation) => (
                      <Button
                        key={savedLocation.id}
                        type="button"
                        variant="ghost"
                        onClick={() => handleSavedLocationSelect(savedLocation)}
                        className="w-full justify-start h-auto p-3"
                      >
                        <div className="flex items-start gap-3 w-full">
                          <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                          <div className="text-left space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{savedLocation.label}</span>
                              {savedLocation.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {savedLocation.location.addressLine}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {[
                                savedLocation.location.city,
                                savedLocation.location.state,
                                savedLocation.location.pincode
                              ].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            {!useDefault && (
              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-xs text-muted-foreground px-2">Or create new location</span>
                <div className="h-px bg-border flex-1" />
              </div>
            )}
          </>
        )}

        {/* Address Search - Hidden if using default */}
        {!useDefault && (
          <div className="space-y-2">
            <Label>
              Search Address {required && "*"}
            </Label>
            <AddressAutocomplete
              onAddressSelect={handleAddressSelect}
              placeholder="Search for your address..."
              value={location?.addressLine || ""}
              error={locationError && !location ? "Location is required" : undefined}
            />
            {required && !location && (
              <p className="text-sm text-destructive">Location is required</p>
            )}
          </div>
        )}

        {/* Show selected address details */}
        {!useDefault && location && location.addressLine && (
          <div className="p-3 bg-muted/50 rounded-md space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">{location.addressLine}</p>
                {(location.city || location.state || location.pincode) && (
                  <p className="text-xs text-muted-foreground">
                    {[location.city, location.state, location.pincode, location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Save to Address Book Option */}
            {enableAddressBook && (
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-address-book"
                    checked={saveToAddressBook}
                    onCheckedChange={(checked) => setSaveToAddressBook(!!checked)}
                  />
                  <Label htmlFor="save-address-book" className="text-sm cursor-pointer">
                    Save to my address book
                  </Label>
                </div>
                {saveToAddressBook && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleSaveToAddressBook}
                    disabled={createAndAddLocationMutation.isPending}
                  >
                    {createAndAddLocationMutation.isPending ? (
                      <>
                        <LoadingSpinner className="h-3 w-3 mr-1" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="h-3 w-3 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual Address Entry */}
        <div className="space-y-4 p-4 border rounded-md bg-muted/25">
          <h4 className="font-medium">Manual Entry</h4>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine">
                  Address Line {required && "*"}
                </Label>
                <Input
                  id="addressLine"
                  placeholder="House number, street name, area"
                  value={location?.addressLine || ""}
                  onChange={(e) => updateLocationField("addressLine", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City {required && "*"}
                  </Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={location?.city || ""}
                    onChange={(e) => updateLocationField("city", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">
                    State {required && "*"}
                  </Label>
                  <Input
                    id="state"
                    placeholder="Enter state"
                    value={location?.state || ""}
                    onChange={(e) => updateLocationField("state", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode">
                    Pincode {required && "*"}
                  </Label>
                  <Input
                    id="pincode"
                    placeholder="Enter pincode"
                    value={location?.pincode || ""}
                    onChange={(e) => updateLocationField("pincode", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Country"
                    value={location?.country || "India"}
                    onChange={(e) => updateLocationField("country", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Validation for manual entry */}
            {required && location && (!location.addressLine || !location.city || !location.state || !location.pincode) && (
              <p className="text-sm text-destructive">
                Please fill in all required fields (Address Line, City, State, Pincode)
              </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}