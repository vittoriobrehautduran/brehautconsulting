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
      const dateStr = selectedDate.toISOString().split('T')[0]
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
    const [start, end] = slot.split('-')
    return `${start}:00 - ${end}:00`
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {selectedDate && selectedTimeSlot && (
        <Card className="border-[#f5f5f5]/20 bg-card/50">
          <CardContent className="pt-6">
            <Label className="text-sm font-medium text-muted-foreground mb-2 block">
              Selected Time Slot
            </Label>
            <h4 className="text-lg font-semibold mb-1">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h4>
            <p className="text-[#f5f5f5] font-medium">{formatTimeSlot(selectedTimeSlot)} (Stockholm time)</p>
          </CardContent>
        </Card>
      )}

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company (optional)</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={handleChange('company')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={handleChange('message')}
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!selectedDate || !selectedTimeSlot || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Confirming...
          </>
        ) : (
          'Confirm Booking'
        )}
      </Button>
    </form>
  )
}
