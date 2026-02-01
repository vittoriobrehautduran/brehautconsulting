"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { WORK_DAYS } from "@/lib/constants"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  selectedDate: Date | null
  onDateChange: (date: Date | null) => void
  isLoading?: boolean
}

export default function DatePicker({
  selectedDate,
  onDateChange,
  isLoading = false,
}: DatePickerProps) {
  // Check if a date should be disabled (not a work day or past date)
  const shouldDisableDate = (date: Date): boolean => {
    // Check if it's a work day (Monday-Thursday)
    const dayOfWeek = date.getDay()
    const isWorkDay = WORK_DAYS.includes(dayOfWeek)
    
    // Check if it's in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    const isPastDate = compareDate < today
    
    return !isWorkDay || isPastDate
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-heading font-semibold">Select a Date (Monday - Thursday)</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
            disabled={isLoading}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={(date) => onDateChange(date || null)}
            disabled={shouldDisableDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

