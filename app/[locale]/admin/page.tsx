'use client'

import { useState, FormEvent, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Calendar as CalendarIcon, BarChart3, Settings } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format, parseISO } from 'date-fns'

type Page = 'calendar' | 'statistics' | 'settings'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  
  const [currentPage, setCurrentPage] = useState<Page>('calendar')
  
  const [busyDays, setBusyDays] = useState<Set<string>>(new Set())
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set())
  const [isLoadingBusyDays, setIsLoadingBusyDays] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadBusyDays()
    }
  }, [isAuthenticated])

  const loadBusyDays = async () => {
    setIsLoadingBusyDays(true)
    try {
      const response = await fetch('/.netlify/functions/get-busy-days')
      const data = await response.json()

      if (response.ok && data.success) {
        const dates = new Set<string>(data.busyDays.map((day: { date: string }) => format(parseISO(day.date), 'yyyy-MM-dd')))
        setBusyDays(dates)
        setSelectedDays(new Set(dates))
      }
    } catch (error) {
      console.error('Error loading busy days:', error)
    } finally {
      setIsLoadingBusyDays(false)
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setIsLoggingIn(true)

    try {
      const response = await fetch('/.netlify/functions/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid password')
      }

      setIsAuthenticated(true)
      setPassword('')
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleDayClick = (date: Date | undefined) => {
    if (!date || isSaving) return

    const dateStr = format(date, 'yyyy-MM-dd')
    const newSelectedDays = new Set(selectedDays)

    if (newSelectedDays.has(dateStr)) {
      newSelectedDays.delete(dateStr)
    } else {
      newSelectedDays.add(dateStr)
    }

    setSelectedDays(newSelectedDays)
  }

  const handleConfirmBusyDays = async () => {
    if (selectedDays.size === 0) {
      setMessage({ type: 'error', text: 'Please select at least one day' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const datesToAdd = Array.from(selectedDays).filter(date => !busyDays.has(date))
      const datesToRemove = Array.from(busyDays).filter(date => !selectedDays.has(date))

      const promises = [
        ...datesToAdd.map(date => 
          fetch('/.netlify/functions/toggle-busy-day', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, action: 'add' }),
          })
        ),
        ...datesToRemove.map(date =>
          fetch('/.netlify/functions/toggle-busy-day', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, action: 'remove' }),
          })
        ),
      ]

      const results = await Promise.all(promises)
      const allSuccess = results.every(async (res) => {
        const data = await res.json()
        return res.ok && data.success
      })

      if (!allSuccess) {
        throw new Error('Some operations failed')
      }

      setBusyDays(new Set(selectedDays))
      setSelectedDays(new Set())
      setMessage({ 
        type: 'success', 
        text: `Successfully updated ${datesToAdd.length + datesToRemove.length} day(s)` 
      })

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update busy days',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveBusyDay = async (dateStr: string) => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/.netlify/functions/toggle-busy-day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateStr,
          action: 'remove',
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to remove busy day')
      }

      const newBusyDays = new Set(busyDays)
      newBusyDays.delete(dateStr)
      setBusyDays(newBusyDays)
      
      if (selectedDays.has(dateStr)) {
        const newSelectedDays = new Set(selectedDays)
        newSelectedDays.delete(dateStr)
        setSelectedDays(newSelectedDays)
      }

      setMessage({ type: 'success', text: 'Busy day removed' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to remove busy day',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const isDaySelected = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return selectedDays.has(dateStr)
  }

  const isDayBusy = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return busyDays.has(dateStr)
  }

  if (!isAuthenticated) {
    return (
      <div className="container max-w-md pt-24 pb-16 px-4">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-md">
          <h1 className="text-3xl font-heading font-bold mb-6 text-white text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <Alert variant="destructive">
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoggingIn && <Loader2 className="h-4 w-4 animate-spin" />}
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl pt-24 pb-16 px-4">
      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md sticky top-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-heading font-bold text-white">Dashboard</h2>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-white/70 hover:text-white transition-colors text-xs underline"
              >
                Logout
              </button>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setCurrentPage('calendar')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'calendar'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <CalendarIcon className="h-5 w-5" />
                <span>Calendar</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('statistics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'statistics'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Statistics</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'settings'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {currentPage === 'calendar' && (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-md">
              <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-white mb-2">
                  Manage Busy Days
                </h1>
                <p className="text-white/70 text-sm">
                  Select days in the calendar, then click confirm to mark them as busy
                </p>
              </div>

              {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'success'} className="mb-6">
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                {isLoadingBusyDays ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                ) : (
                  <Calendar
                    mode="multiple"
                    selected={Array.from(selectedDays).map(dateStr => parseISO(dateStr + 'T00:00:00'))}
                    onSelect={(dates) => {
                      if (dates) {
                        const dateSet = new Set<string>(dates.map(d => format(d, 'yyyy-MM-dd')))
                        setSelectedDays(dateSet)
                      } else {
                        setSelectedDays(new Set())
                      }
                    }}
                    disabled={isSaving}
                    modifiers={{
                      busy: (date) => isDayBusy(date),
                    }}
                    className="mx-auto"
                  />
                )}
              </div>

              {selectedDays.size > 0 && (
                <div className="mb-6 p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                  <p className="text-white/90 text-sm mb-3">
                    {selectedDays.size} day(s) selected. Click confirm to save changes.
                  </p>
                  <button
                    onClick={handleConfirmBusyDays}
                    disabled={isSaving}
                    className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Confirm Changes
                  </button>
                </div>
              )}

              {/* Busy Days List */}
              {busyDays.size > 0 && (
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-heading font-semibold text-white mb-4">
                    Currently Busy Days
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Array.from(busyDays)
                      .sort()
                      .map((dateStr) => (
                        <div
                          key={dateStr}
                          className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                        >
                          <span className="text-white/90">
                            {format(parseISO(dateStr), 'EEEE, MMMM d, yyyy')}
                          </span>
                          <button
                            onClick={() => handleRemoveBusyDay(dateStr)}
                            disabled={isSaving}
                            className="px-4 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-600/50 border border-red-600/70"></div>
                    <span>Currently busy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-600/50 border border-blue-600/70"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white/10 border border-white/20"></div>
                    <span>Available</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'statistics' && (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-md">
              <h1 className="text-3xl font-heading font-bold text-white mb-4">
                Statistics
              </h1>
              <p className="text-white/70">
                Statistics and analytics will be available here.
              </p>
            </div>
          )}

          {currentPage === 'settings' && (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-md">
              <h1 className="text-3xl font-heading font-bold text-white mb-4">
                Settings
              </h1>
              <p className="text-white/70">
                Settings and configuration will be available here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
