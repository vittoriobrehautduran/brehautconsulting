// Database queries for busy days

import { prisma } from './client'
import { formatDateForStorage, parseDateFromStorage } from '@/lib/google-calendar/utils'

// Check if a specific date is marked as busy
export async function isDateBusy(date: Date): Promise<boolean> {
  const dateStr = formatDateForStorage(date)
  const parsedDate = parseDateFromStorage(dateStr)

  const busyDay = await prisma.busyDay.findUnique({
    where: {
      date: parsedDate,
    },
  })

  return busyDay !== null
}

// Get all busy days in a date range
export async function getBusyDaysInRange(startDate: Date, endDate: Date) {
  const startDateStr = formatDateForStorage(startDate)
  const endDateStr = formatDateForStorage(endDate)
  const parsedStartDate = parseDateFromStorage(startDateStr)
  const parsedEndDate = parseDateFromStorage(endDateStr)

  // Get end of day for endDate
  const endOfDay = new Date(parsedEndDate)
  endOfDay.setHours(23, 59, 59, 999)

  return await prisma.busyDay.findMany({
    where: {
      date: {
        gte: parsedStartDate,
        lte: endOfDay,
      },
    },
    orderBy: {
      date: 'asc',
    },
  })
}

// Add a busy day
export async function addBusyDay(date: Date) {
  const dateStr = formatDateForStorage(date)
  const parsedDate = parseDateFromStorage(dateStr)

  return await prisma.busyDay.upsert({
    where: {
      date: parsedDate,
    },
    update: {},
    create: {
      date: parsedDate,
    },
  })
}

// Remove a busy day
export async function removeBusyDay(date: Date) {
  const dateStr = formatDateForStorage(date)
  const parsedDate = parseDateFromStorage(dateStr)

  return await prisma.busyDay.delete({
    where: {
      date: parsedDate,
    },
  })
}

// Get all busy days
export async function getAllBusyDays() {
  return await prisma.busyDay.findMany({
    orderBy: {
      date: 'asc',
    },
  })
}

