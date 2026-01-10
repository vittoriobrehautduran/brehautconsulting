// Time slot selector component

import { Button } from '@/components/ui/button'
import { TimeSlot, TIME_SLOTS } from '@/lib/constants'
import { AvailableSlot } from '@/types/booking'
import { cn } from '@/lib/utils'

interface TimeSlotSelectorProps {
  availableSlots: AvailableSlot[]
  selectedTimeSlot: TimeSlot | null
  onSelect: (timeSlot: TimeSlot) => void
  isLoading?: boolean
}

export default function TimeSlotSelector({
  availableSlots,
  selectedTimeSlot,
  onSelect,
  isLoading = false,
}: TimeSlotSelectorProps) {
  const formatTimeSlot = (slot: TimeSlot): string => {
    const [start, end] = slot.split('-')
    return `${start}:00 - ${end}:00`
  }

  const getSlotAvailability = (timeSlot: TimeSlot): boolean => {
    const slot = availableSlots.find((s) => s.timeSlot === timeSlot)
    return slot?.available ?? false
  }

  return (
    <div>
      <h3 className="text-xl font-heading font-semibold mb-4">Available Time Slots (Stockholm time)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TIME_SLOTS.map((timeSlot) => {
          const isAvailable = getSlotAvailability(timeSlot)
          const isSelected = selectedTimeSlot === timeSlot

          return (
            <Button
              key={timeSlot}
              variant={isSelected ? "default" : "outline"}
              disabled={!isAvailable || isLoading}
              onClick={() => onSelect(timeSlot)}
              className={cn(
                "py-6 text-base font-semibold",
                !isAvailable && "opacity-30 cursor-not-allowed"
              )}
            >
              {formatTimeSlot(timeSlot)}
            </Button>
          )
        })}
      </div>
      {availableSlots.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Please select a date to see available time slots.
        </p>
      )}
    </div>
  )
}
