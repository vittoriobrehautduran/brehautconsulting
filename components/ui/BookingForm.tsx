// Booking form component with validation

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { TimeSlot } from '@/lib/constants'
import { BookingRequest } from '@/types/booking'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Format date as YYYY-MM-DD in local time (not UTC)
function formatDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface BookingFormProps {
  selectedDate: Date | null
  selectedTimeSlot: TimeSlot | null
  onSubmit: (data: BookingRequest) => Promise<void>
  isLoading?: boolean
}

export default function BookingForm({
  selectedDate,
  selectedTimeSlot,
  onSubmit,
  isLoading = false,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setSubmitError(null)
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    // Validate required fields
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!selectedDate || !selectedTimeSlot) {
      setSubmitError('Please select a date and time slot')
      return
    }

    try {
      const dateStr = formatDateLocal(selectedDate)
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || undefined,
        message: formData.message.trim() || undefined,
        date: dateStr,
        timeSlot: selectedTimeSlot,
      })

      // Reset form on success
      setFormData({ name: '', email: '', company: '', message: '' })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create booking')
    }
  }

  const formatTimeSlot = (slot: TimeSlot): string => {
    const [start] = slot.split('-')
    return `${start}:00`
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {selectedDate && selectedTimeSlot && (
        <Card className="border-blue-500/30 bg-blue-950/20">
          <CardContent className="pt-6">
            <Label className="text-base font-medium text-blue-300/80 mb-3 block">
              Selected Time Slot
            </Label>
            <h4 className="text-xl font-semibold mb-2 text-blue-100">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h4>
            <p className="text-blue-200 font-medium text-lg">{formatTimeSlot(selectedTimeSlot)} (Stockholm time)</p>
          </CardContent>
        </Card>
      )}

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-blue-100 text-base">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange('name')}
            className={cn(
              "h-12 text-base border-blue-500/30 bg-blue-950/20 text-white placeholder:text-blue-300/50",
              "focus-visible:ring-blue-500/50 focus-visible:border-blue-400",
              errors.name ? 'border-destructive' : ''
            )}
          />
          {errors.name && <p className="text-base text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-blue-100 text-base">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            className={cn(
              "h-12 text-base border-blue-500/30 bg-blue-950/20 text-white placeholder:text-blue-300/50",
              "focus-visible:ring-blue-500/50 focus-visible:border-blue-400",
              errors.email ? 'border-destructive' : ''
            )}
          />
          {errors.email && <p className="text-base text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-3">
          <Label htmlFor="company" className="text-blue-100 text-base">Company (optional)</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={handleChange('company')}
            className="h-12 text-base border-blue-500/30 bg-blue-950/20 text-white placeholder:text-blue-300/50 focus-visible:ring-blue-500/50 focus-visible:border-blue-400"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="message" className="text-blue-100 text-base">Message (optional)</Label>
          <Textarea
            id="message"
            rows={5}
            value={formData.message}
            onChange={handleChange('message')}
            className="text-base border-blue-500/30 bg-blue-950/20 text-white placeholder:text-blue-300/50 focus-visible:ring-blue-500/50 focus-visible:border-blue-400"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white border-blue-500 text-lg font-semibold"
        disabled={!selectedDate || !selectedTimeSlot || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Confirming...
          </>
        ) : (
          'Confirm Booking'
        )}
      </Button>
    </form>
  )
}
