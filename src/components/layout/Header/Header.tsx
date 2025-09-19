"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMyProfile } from "@/features/profile/hooks/useProfile";
import { useBrowserLocation } from "@/hooks/useBrowserLocation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import RangeDatePicker from "@/components/ui/range-date-picker";
import ProximitySelector from "@/components/ui/proximity-selector";
import { format } from "date-fns";
import { citiesApi } from "@/lib/api/cities";
import {
  List,
  Plus,
  ShoppingCart,
  MapPin,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { type DateRange } from "react-day-picker";
import { useAppStore } from "@/stores/useAppStore";

type CitySelectorProps = {
  value?: string | null;
  onChange?: (city: string) => void;
};

function CitySelector({ value, onChange }: CitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoSelectedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { latitude, longitude, hasLocation } = useBrowserLocation();

  useEffect(() => {
    let cancelled = false;
    const fetchCities = async (opts?: { lat?: number; lon?: number }) => {
      try {
        setLoading(true);
        setError(null);
        const data = await citiesApi.getCities(opts);
        if (!cancelled) setCities(data.cities || []);
      } catch {
        if (!cancelled) setError("Could not load cities");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (hasLocation && latitude && longitude) {
      fetchCities({ lat: latitude, lon: longitude });
    } else {
      fetchCities();
    }

    return () => {
      cancelled = true;
    };
  }, [hasLocation, latitude, longitude]);

  useEffect(() => {
    if (!autoSelectedRef.current && !value && cities.length > 0) {
      onChange?.(cities[0]);
      autoSelectedRef.current = true;
    }
  }, [cities, value, onChange]);

  const filtered = useMemo(() => {
    if (!query) return cities;
    const q = query.toLowerCase();
    return cities.filter((c) => c.toLowerCase().includes(q));
  }, [cities, query]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="pl-2 pr-3">
          <MapPin className="size-4" />
          <span className="ml-1 hidden sm:inline">
            {value || "Select city"}
          </span>
          <ChevronDown className="ml-1 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel className="flex items-center gap-2">
          Cities in India
        </DropdownMenuLabel>
        <div className="px-2 pb-2">
          <Input
            ref={inputRef}
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              // Prevent losing focus when arrow keys are pressed
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
              }
            }}
            autoFocus
          />
        </div>
        {loading && (
          <div className="px-2 py-2 text-sm text-muted-foreground">
            Loading...
          </div>
        )}
        {error && (
          <div className="px-2 py-2 text-sm text-destructive">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="px-2 py-2 text-sm text-muted-foreground">
            No results
          </div>
        )}
        {!loading && !error && (
          <div className="max-h-72 overflow-y-auto">
            {filtered.map((city) => (
              <DropdownMenuItem
                key={city}
                onSelect={() => {
                  onChange?.(city);
                  setOpen(false);
                }}
                onFocus={(e) => {
                  // Prevent auto-focusing on dropdown items
                  e.preventDefault();
                  inputRef.current?.focus();
                }}
              >
                {city}
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type DateRangeSelectorProps = {
  startDate?: string | null;
  endDate?: string | null;
  onChange?: (value: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
};

function DateRangeSelector({
  startDate,
  endDate,
  onChange,
}: DateRangeSelectorProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });

  useEffect(() => {
    if (dateRange?.from || dateRange?.to) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let adjustedStartDate = dateRange.from;
      let adjustedEndDate = dateRange.to;

      // If start date is less than today, set it to today
      if (adjustedStartDate && adjustedStartDate < today) {
        adjustedStartDate = new Date(today);
      }

      // If end date is less than or equal to today, set it to today + 1
      if (adjustedEndDate && adjustedEndDate <= today) {
        adjustedEndDate = new Date(today);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      }

      onChange?.({
        startDate: adjustedStartDate ? format(adjustedStartDate, "yyyy-MM-dd") : null,
        endDate: adjustedEndDate ? format(adjustedEndDate, "yyyy-MM-dd") : null,
      });
    }
  }, [dateRange, onChange]);

  return (
    <RangeDatePicker
      value={dateRange}
      onChange={setDateRange}
      CalendarComponent={Calendar}
    />
  );
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: myProfileRes } = useMyProfile();
  const myProfile = myProfileRes?.data;
  const [scrolled, setScrolled] = useState(false);
  const city = useAppStore((s) => s.selectedCity);
  const startDate = useAppStore((s) => s.startDate);
  const endDate = useAppStore((s) => s.endDate);
  const proximityEnabled = useAppStore((s) => s.proximityEnabled);
  const proximityRadius = useAppStore((s) => s.proximityRadius);
  const setSelectedCity = useAppStore((s) => s.setSelectedCity);
  const setDateRange = useAppStore((s) => s.setDateRange);
  const setProximityEnabled = useAppStore((s) => s.setProximityEnabled);
  const setProximityRadius = useAppStore((s) => s.setProximityRadius);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Use profile fullName if available, fallback to auth name
  const displayName = myProfile?.fullName || user?.name || "User";
  const avatarUrl = myProfile?.avatarUrl;

  const initials = useMemo(() => {
    return (
      displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join("") || "U"
    );
  }, [displayName]);

  return (
    <header
      data-scrolled={scrolled}
      className="fixed top-0 inset-x-0 z-50 transition-all data-[scrolled=true]:bg-background/80 data-[scrolled=true]:backdrop-blur supports-[backdrop-filter]:data-[scrolled=true]:bg-background/60 border-b border-transparent data-[scrolled=true]:border-border"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Left: Logo + City + Date */}
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <Link href="/" className="shrink-0 font-bold text-xl sm:text-2xl">
              P2P
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <CitySelector
                value={city ?? undefined}
                onChange={setSelectedCity}
              />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <DateRangeSelector
                startDate={startDate}
                endDate={endDate}
                onChange={setDateRange}
              />
            </div>
            {isAuthenticated && (
              <div className="hidden lg:flex items-center gap-2">
                <ProximitySelector
                  enabled={proximityEnabled}
                  radius={proximityRadius}
                  onEnabledChange={setProximityEnabled}
                  onRadiusChange={setProximityRadius}
                  compact
                />
              </div>
            )}
          </div>

          {/* Right: Icons + Auth */}
          <div className="flex items-center gap-1 sm:gap-2">
            {isAuthenticated && (
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" aria-label="Dashboard">
                  <LayoutDashboard className="size-5" />
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="size-5" />
            </Button>
            {isAuthenticated && (
              <Link href="/products/add">
                <Button variant="ghost" size="icon" aria-label="Add Product">
                  <Plus className="size-5" />
                </Button>
              </Link>
            )}
            {isAuthenticated && (
              <Link href="/listings">
                <Button variant="ghost" size="icon" aria-label="My Listings">
                  <List className="size-5" />
                </Button>
              </Link>
            )}
            {!isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2 pl-2">
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div
                className="pl-1"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <DropdownMenu
                  open={userMenuOpen}
                  onOpenChange={setUserMenuOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 gap-2 pr-3">
                      <Avatar>
                        <AvatarImage
                          src={avatarUrl || undefined}
                          alt={displayName}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <span className="max-w-[8rem] truncate">
                        {displayName}
                      </span>
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
                    <div className="px-2 pb-2 text-sm text-muted-foreground truncate">
                      {displayName}
                    </div>
                    <DropdownMenuSeparator />
                    <Link href={user?.id ? `/profile/${user.id}` : "/signin"}>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => logout()}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
