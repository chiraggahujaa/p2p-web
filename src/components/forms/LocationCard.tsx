"use client";

import { UseFormSetValue, UseFormWatch, FieldErrors, Path, FieldValues } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { CreateLocationDto } from "@/types";
import { MapPin } from "lucide-react";
import { cn } from "@/utils/ui";

interface LocationCardProps<T extends FieldValues> {
  title?: string;
  description?: string;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  errors: FieldErrors<T>;
  locationFieldName: Path<T>;
  required?: boolean;
  className?: string;
}

export function LocationCard<T extends FieldValues>({
  title = "Location",
  description = "Specify where the product is located",
  setValue,
  watch,
  errors,
  locationFieldName,
  required = true,
  className,
}: LocationCardProps<T>) {
  const location = watch(locationFieldName) as unknown as CreateLocationDto | null;
  const locationError = errors[locationFieldName as keyof FieldErrors<T>];

  const handleAddressSelect = (address: CreateLocationDto) => {
    setValue(locationFieldName, address as T[Path<T>]);
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
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address Autocomplete */}
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
          <p className="text-xs text-muted-foreground">
            Search for your complete address for better visibility, or fill in the details manually below.
          </p>
        </div>

        {/* Show selected address details */}
        {location && location.addressLine && (
          <div className="p-3 bg-muted/50 rounded-md space-y-2">
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
          </div>
        )}

        {/* Manual Address Entry - Always Visible */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground px-2">Or enter details manually</span>
            <div className="h-px bg-border flex-1" />
          </div>

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