"use client"

import {
  type CalendarEvent,
  type EventCategory,
  categoryConfig,
  weekDays,
} from "@/lib/calendar-data"
import { cn } from "@/lib/utils"

interface MonthGridProps {
  year: number
  month: number
  monthName: string
  events: CalendarEvent[]
  selectedCategories: EventCategory[]
  onSelectEvent: (event: CalendarEvent) => void
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function MonthGrid({
  year,
  month,
  monthName,
  events,
  selectedCategories,
  onSelectEvent,
}: MonthGridProps) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const filteredEvents = events.filter((event) =>
    selectedCategories.includes(event.category)
  )

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return filteredEvents.filter((event) => {
      if (event.endDate) {
        return dateStr >= event.date && dateStr <= event.endDate
      }
      return event.date === dateStr
    })
  }

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month
  const currentDay = today.getDate()

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-lg">
      <h3 className="mb-4 text-center text-lg font-bold text-foreground">{monthName}</h3>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dayEvents = getEventsForDay(day)
          const isToday = isCurrentMonth && day === currentDay
          const hasEvents = dayEvents.length > 0

          return (
            <div
              key={day}
              className={cn(
                "relative aspect-square rounded-md p-1 transition-colors",
                isToday && "bg-primary/20 ring-1 ring-primary",
                hasEvents && !isToday && "bg-secondary/50",
                hasEvents && "cursor-pointer hover:bg-secondary"
              )}
              onClick={() => {
                if (dayEvents.length > 0) {
                  onSelectEvent(dayEvents[0])
                }
              }}
            >
              <span
                className={cn(
                  "text-xs",
                  isToday && "font-bold text-primary",
                  !isToday && "text-foreground"
                )}
              >
                {day}
              </span>

              {hasEvents && (
                <div className="absolute bottom-1 left-1 right-1 flex flex-wrap justify-center gap-0.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <span
                      key={event.id}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        categoryConfig[event.category].color
                      )}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px] text-muted-foreground">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
