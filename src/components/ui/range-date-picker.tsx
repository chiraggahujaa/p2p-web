"use client"

import * as React from "react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"

import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type RangeDatePickerProps = {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  CalendarComponent: React.ComponentType<{
    mode: "range"
    defaultMonth?: Date
    selected?: DateRange
    onSelect?: (range: DateRange | undefined) => void
    disabled?: import("react-day-picker").Matcher | import("react-day-picker").Matcher[] | undefined
    className?: string
  }>
  disablePast?: boolean
  className?: string
}

export function RangeDatePicker({
  value,
  onChange,
  CalendarComponent,
  disablePast = true,
  className,
}: RangeDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [range, setRange] = React.useState<DateRange | undefined>(value)

  React.useEffect(() => {
    setRange(value)
  }, [value])

  const fromValue = range?.from ? format(range.from, "yyyy-MM-dd") : ""
  const toValue = range?.to ? format(range.to, "yyyy-MM-dd") : ""

  const startOfToday = React.useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={["flex items-center gap-2 cursor-pointer", className].filter(Boolean).join(" ")}> 
          <Input type="date" value={fromValue} readOnly placeholder="From" className="h-9 w-[9.5rem]" />
          <span className="text-muted-foreground">–</span>
          <Input type="date" value={toValue} readOnly placeholder="To" className="h-9 w-[9.5rem]" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="p-0 bg-transparent border-none shadow-none z-[9999]"
      >
        <CalendarComponent
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={(next) => {
            setRange(next)
            onChange?.(next)
          }}
          disabled={disablePast ? { before: startOfToday } : undefined}
          className="rounded-lg border bg-white shadow-lg w-[300px]"
        />
      </PopoverContent>
    </Popover>
  )
}

export default RangeDatePicker


