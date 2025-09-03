"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/utils/ui";
import { toast } from "sonner";
import api from "@/lib/api/axios";
import { CreateLocationDto } from "@/types/location";

interface AddressSuggestion {
  display_name: string;
  place_id?: string;
  importance?: number;
  class?: string;
  type?: string;
  lat?: string;
  lon?: string;
  boundingbox?: string[];
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: CreateLocationDto) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  value?: string;
  error?: string;
}

export function AddressAutocomplete({
  onAddressSelect,
  placeholder = "Search for an address...",
  className,
  disabled = false,
  value = "",
  error,
}: AddressAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);

  // Rate limiting state
  const [requestCount, setRequestCount] = useState(0);
  const [rateLimitReset, setRateLimitReset] = useState<Date | null>(null);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rate limiting check
  const isRateLimited = useCallback(() => {
    if (!rateLimitReset) return false;
    const now = new Date();
    if (now > rateLimitReset) {
      setRequestCount(0);
      setRateLimitReset(null);
      return false;
    }
    return requestCount >= 30; // 30 requests per 5 minutes
  }, [requestCount, rateLimitReset]);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 3) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      if (isRateLimited()) {
        toast.error("Rate limit exceeded. Please wait before searching again.");
        setIsLoading(false);
        return;
      }

      try {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        const response = await api.get(`/api/addresses/suggestions`, {
          params: {
            query: query.trim(),
            limit: 5,
          },
          signal: abortControllerRef.current.signal,
        });

        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Transform string responses to AddressSuggestion objects
          const transformedSuggestions: AddressSuggestion[] = response.data.data.map((addressString: string, index: number) => ({
            display_name: addressString,
            place_id: `suggestion-${index}`,
            importance: 1 - (index * 0.1), // Higher importance for earlier results
            class: 'place',
            type: 'address',
          }));
          
          setSuggestions(transformedSuggestions);
          
          // Update rate limiting counters
          setRequestCount((prev) => prev + 1);
          if (!rateLimitReset) {
            setRateLimitReset(new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes from now
          }
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // Request was cancelled, ignore
          return;
        }
        
        console.error("Address search error:", error);
        setSuggestions([]);
        
        const errorResponse = error as { response?: { status?: number } };
        if (errorResponse.response?.status === 429) {
          toast.error("Rate limit exceeded. Please wait before searching again.");
        } else if (errorResponse.response?.status && errorResponse.response.status >= 500) {
          toast.error("Search service is temporarily unavailable. Please try again later.");
        } else if (!navigator.onLine) {
          toast.error("No internet connection. Please check your network and try again.");
        } else {
          toast.error("Failed to search addresses. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isRateLimited, rateLimitReset]
  );

  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      setSelectedIndex(-1);
      
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        debouncedSearch(value);
      }, 300);
    },
    [debouncedSearch]
  );

  // Transform API response to CreateLocationDto
  const transformAddressResponse = (suggestion: AddressSuggestion): CreateLocationDto => {
    const addr = suggestion.address || {};
    
    // Parse the display_name to extract components
    // Format: "Area, Tehsil, City, State, Pincode, Country"
    const parts = suggestion.display_name.split(", ");
    
    // Build address line from available components
    let addressLine = "";
    let city = "";
    let state = "";
    let pincode = "";
    let country = "";
    
    if (parts.length >= 1) {
      addressLine = parts[0]; // First part is usually the specific address/area
    }
    
    if (parts.length >= 3) {
      city = parts[parts.length - 4] || parts[1]; // Try to get city
    }
    
    if (parts.length >= 2) {
      state = parts[parts.length - 3] || ""; // Try to get state
    }
    
    // Look for pincode pattern (5-6 digits)
    const pincodeMatch = suggestion.display_name.match(/\b\d{5,6}\b/);
    if (pincodeMatch) {
      pincode = pincodeMatch[0];
    }
    
    // Country is usually the last part
    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1];
      if (lastPart && lastPart.toLowerCase().includes('india')) {
        country = lastPart;
      }
    }
    
    // Fallback to structured address if available
    return {
      addressLine: addr.road || addressLine || suggestion.display_name.split(",")[0],
      city: addr.city || addr.suburb || city || "",
      state: addr.state || state || "",
      pincode: addr.postcode || pincode || "",
      country: addr.country || country || "India",
      latitude: suggestion.lat ? parseFloat(suggestion.lat) : undefined,
      longitude: suggestion.lon ? parseFloat(suggestion.lon) : undefined,
    };
  };

  // Handle address selection
  const handleAddressSelect = async (suggestion: AddressSuggestion) => {
    setIsResolvingAddress(true);
    
    try {
      // First try to get full details using the search endpoint
      const response = await api.get(`/api/addresses/search`, {
        params: {
          query: suggestion.display_name,
          limit: 1,
        },
      });

      let fullAddress: CreateLocationDto;
      
      if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        // If the search endpoint returns the same format as suggestions, we need to transform it
        const searchResult = typeof response.data.data[0] === 'string' 
          ? { display_name: response.data.data[0] }
          : response.data.data[0];
        fullAddress = transformAddressResponse(searchResult);
      } else {
        // Fallback to using the suggestion data
        fullAddress = transformAddressResponse(suggestion);
      }

      onAddressSelect(fullAddress);
      setInputValue(suggestion.display_name);
      setOpen(false);
      setSuggestions([]);
      
      toast.success("Address selected successfully");
    } catch (error) {
      console.error("Address resolution error:", error);
      
      // Fallback: use suggestion data directly
      try {
        const fallbackAddress = transformAddressResponse(suggestion);
        onAddressSelect(fallbackAddress);
        setInputValue(suggestion.display_name);
        setOpen(false);
        setSuggestions([]);
        
        toast.warning("Address selected with limited details");
      } catch (fallbackError) {
        console.error("Fallback transformation error:", fallbackError);
        toast.error("Failed to select address. Please try again.");
      }
    } finally {
      setIsResolvingAddress(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleAddressSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setSuggestions([]);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label="Search for address"
            className={cn(
              "w-full justify-between text-left font-normal",
              !inputValue && "text-muted-foreground",
              error && "border-destructive",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled || isResolvingAddress}
            onClick={() => !disabled && setOpen(true)}
          >
            <div className="flex items-center flex-1 min-w-0">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {inputValue || placeholder}
              </span>
            </div>
            {isResolvingAddress ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin flex-shrink-0" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <MapPin className="mr-2 h-4 w-4 opacity-50" />
              <Input
                ref={inputRef}
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-0 shadow-none focus-visible:ring-0 h-10"
                disabled={disabled}
                aria-label="Address search input"
                autoComplete="off"
              />
              {isLoading && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />
              )}
            </div>
            <CommandList className="max-h-60">
              {isLoading ? (
                <div className="p-4 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-muted animate-pulse rounded"
                      aria-label={`Loading suggestion ${i + 1}`}
                    />
                  ))}
                </div>
              ) : suggestions.length === 0 && inputValue.length >= 3 ? (
                <CommandEmpty>
                  <div className="flex flex-col items-center justify-center p-4 text-sm text-muted-foreground">
                    <MapPin className="h-6 w-6 mb-2 opacity-50" />
                    No addresses found for &ldquo;{inputValue}&rdquo;
                  </div>
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {suggestions.map((suggestion, index) => (
                    <CommandItem
                      key={suggestion.place_id || index}
                      value={suggestion.display_name}
                      onSelect={() => handleAddressSelect(suggestion)}
                      className={cn(
                        "cursor-pointer",
                        selectedIndex === index && "bg-accent"
                      )}
                      aria-label={`Select address: ${suggestion.display_name}`}
                    >
                      <div className="flex items-start space-x-2 flex-1 min-w-0">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {suggestion.display_name.split(",")[0]}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {suggestion.display_name.split(",").slice(1).join(",").trim()}
                          </div>
                          {suggestion.importance && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {suggestion.class} • {suggestion.type}
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedIndex === index && (
                        <Check className="ml-2 h-4 w-4 flex-shrink-0" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}