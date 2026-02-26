"use client"

import * as React from "react"
import { useTranslations, useLocale } from 'next-intl'
import { format, addDays, subDays, startOfDay } from "date-fns"
import { type Locale } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from "lucide-react"
import { WORK_DAYS, TimeSlot, TIME_SLOTS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { AvailableSlot } from "@/types/booking"

// Lazy load Calendar component to reduce initial bundle size
// Wrap the named export as default for React.lazy
const LazyCalendar = React.lazy(() => 
  import("@/components/ui/calendar").then(module => ({ 
    default: module.Calendar 
  }))
)

interface ScheduleSelectorProps {
  selectedDate: Date | null
  selectedTimeSlot: TimeSlot | null
  availableSlots: AvailableSlot[]
  onDateChange: (date: Date | null) => void
  onTimeSlotSelect: (timeSlot: TimeSlot) => void
  isLoading?: boolean
}

// Find the next available work day from a given date
function getNextWorkDay(date: Date): Date {
  let nextDate = addDays(date, 1)
  while (!WORK_DAYS.includes(nextDate.getDay())) {
    nextDate = addDays(nextDate, 1)
  }
  return nextDate
}

// Find the previous available work day from a given date
function getPreviousWorkDay(date: Date): Date | null {
  const today = startOfDay(new Date())
  let prevDate = subDays(date, 1)
  
  // Don't allow dates before today
  while (prevDate >= today && !WORK_DAYS.includes(prevDate.getDay())) {
    prevDate = subDays(prevDate, 1)
  }
  
  // Return null if we've gone before today
  if (prevDate < today) {
    return null
  }
  
  return prevDate
}

// Get today's date, or the next work day if today is not a work day
function getInitialDate(): Date {
  const today = startOfDay(new Date())
  const dayOfWeek = today.getDay()
  
  if (WORK_DAYS.includes(dayOfWeek)) {
    return today
  }
  
  return getNextWorkDay(today)
}

export default function ScheduleSelector({
  selectedDate,
  selectedTimeSlot,
  availableSlots,
  onDateChange,
  onTimeSlotSelect,
  isLoading = false,
}: ScheduleSelectorProps) {
  const t = useTranslations('booking')
  const locale = useLocale()
  // Use selectedDate directly, or get initial date if not provided
  const currentDate = selectedDate || getInitialDate()

  // Check if a date should be disabled (not a work day or past date)
  const shouldDisableDate = (date: Date): boolean => {
    const dayOfWeek = date.getDay()
    const isWorkDay = WORK_DAYS.includes(dayOfWeek)
    
    const today = startOfDay(new Date())
    const compareDate = startOfDay(date)
    const isPastDate = compareDate < today
    
    return !isWorkDay || isPastDate
  }

  const handlePreviousDay = () => {
    const prevDay = getPreviousWorkDay(currentDate)
    if (prevDay) {
      onDateChange(prevDay)
    }
  }

  const handleNextDay = () => {
    const nextDay = getNextWorkDay(currentDate)
    onDateChange(nextDay)
  }

  const handleCalendarDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date)
    }
  }

  const formatTimeSlot = (slot: TimeSlot): string => {
    const [start] = slot.split('-')
    return `${start}:00`
  }

  const getSlotAvailability = (timeSlot: TimeSlot): boolean => {
    const slot = availableSlots.find((s) => s.timeSlot === timeSlot)
    return slot?.available ?? false
  }

  const [dateLocale, setDateLocale] = React.useState<Locale | null>(null)

  // Dynamically load only the needed date-fns locale
  React.useEffect(() => {
    const loadLocale = async () => {
      let localeModule: any
      switch (locale) {
        case 'sv':
          localeModule = await import('date-fns/locale/sv')
          break
        case 'es':
          localeModule = await import('date-fns/locale/es')
          break
        default:
          localeModule = await import('date-fns/locale/en-US')
      }
      // date-fns locales export both default and named exports
      setDateLocale(localeModule.default || localeModule)
    }
    loadLocale()
  }, [locale])

  const formatDisplayDate = (date: Date): string => {
    const today = startOfDay(new Date())
    const compareDate = startOfDay(date)
    
    if (compareDate.getTime() === today.getTime()) {
      return t('today')
    }
    
    const tomorrow = startOfDay(addDays(today, 1))
    if (compareDate.getTime() === tomorrow.getTime()) {
      return t('tomorrow')
    }
    
    if (!dateLocale) {
      // Fallback to English format while locale loads
      return format(date, "EEEE, MMMM d")
    }
    
    return format(date, "EEEE, MMMM d", { locale: dateLocale })
  }

  const today = startOfDay(new Date())
  const canGoPrevious = getPreviousWorkDay(currentDate) !== null

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePreviousDay}
          disabled={isLoading || !canGoPrevious}
          className={cn(
            "h-14 px-5 border-blue-500/30 bg-blue-950/20 hover:bg-blue-900/30 hover:border-blue-400/50",
            "flex items-center gap-2 text-blue-100",
            (!canGoPrevious || isLoading) && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden sm:inline text-base font-medium">{t('previousDay')}</span>
        </Button>

        <div className="flex items-center gap-3 flex-1 justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-14 px-5 justify-start text-left font-normal flex-shrink-0",
                  "border-blue-500/30 bg-blue-950/20 hover:bg-blue-900/30 hover:border-blue-400/50 text-blue-100"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                <span className="text-base font-medium">{formatDisplayDate(currentDate)}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-black border-blue-500/30 text-white" align="start">
              <React.Suspense fallback={<div className="p-4 text-center text-white/70 text-sm">Loading calendar...</div>}>
                <LazyCalendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleCalendarDateSelect}
                  disabled={shouldDisableDate}
                  initialFocus
                />
              </React.Suspense>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          variant="outline"
          onClick={handleNextDay}
          disabled={isLoading}
          className={cn(
            "h-14 px-5 border-blue-500/30 bg-blue-950/20 hover:bg-blue-900/30 hover:border-blue-400/50",
            "flex items-center gap-2 text-blue-100"
          )}
        >
          <span className="hidden sm:inline text-base font-medium">{t('nextDay')}</span>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Time Slots */}
      <div>
        <h3 className="text-2xl font-heading font-semibold mb-5 text-blue-200">
          {t('availableTimeSlots')} ({t('stockholmTime')})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIME_SLOTS.map((timeSlot) => {
            const isAvailable = getSlotAvailability(timeSlot)
            const isSelected = selectedTimeSlot === timeSlot

            return (
              <Button
                key={timeSlot}
                variant={isSelected ? "default" : "outline"}
                disabled={!isAvailable || isLoading}
                onClick={() => onTimeSlotSelect(timeSlot)}
                className={cn(
                  "py-8 text-lg font-semibold transition-colors",
                  !isAvailable && "opacity-30 cursor-not-allowed border-blue-500/20",
                  !isSelected && !isAvailable && "border-blue-500/20 bg-blue-950/10",
                  !isSelected && isAvailable && "border-blue-500/50 bg-blue-900/40 hover:bg-blue-800/50 hover:border-blue-400/70 text-white",
                  isSelected && "bg-blue-600 text-white hover:bg-blue-700 border-blue-500"
                )}
              >
                {formatTimeSlot(timeSlot)}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

