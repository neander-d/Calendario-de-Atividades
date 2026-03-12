"use client"

import {
  type CalendarEvent,
  type EventCategory,
  categoryConfig,
  months,
} from "@/lib/calendar-data"
import { cn } from "@/lib/utils"
import { Calendar, Clock, MapPin } from "lucide-react"

interface EventListProps {
  events: CalendarEvent[]
  selectedCategories: EventCategory[]
  onSelectEvent: (event: CalendarEvent) => void
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00")
  return date.getDate()
}

function formatMonth(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00")
  return months[date.getMonth()].slice(0, 3)
}

export function EventList({ events, selectedCategories, onSelectEvent }: EventListProps) {
  const filteredEvents = events
    .filter((event) => selectedCategories.includes(event.category))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const groupedByMonth = filteredEvents.reduce(
    (acc, event) => {
      const date = new Date(event.date + "T00:00:00")
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: months[date.getMonth()],
          events: [],
        }
      }
      acc[monthKey].events.push(event)
      return acc
    },
    {} as Record<string, { month: string; events: CalendarEvent[] }>
  )

  return (
    <section id="eventos" className="py-8">
      <h2 className="mb-6 text-2xl font-bold">Próximos Eventos</h2>

      {Object.entries(groupedByMonth).length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Nenhum evento encontrado para os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByMonth).map(([monthKey, { month, events: monthEvents }]) => (
            <div key={monthKey}>
              <h3 className="mb-4 text-lg font-semibold text-muted-foreground">{month}</h3>
              <div className="space-y-3">
                {monthEvents.map((event) => {
                  const config = categoryConfig[event.category]
                  return (
                    <button
                      key={event.id}
                      onClick={() => onSelectEvent(event)}
                      className={cn(
                        "group flex w-full items-start gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
                      )}
                    >
                      <div className="flex flex-col items-center rounded-lg bg-secondary px-3 py-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {formatMonth(event.date)}
                        </span>
                        <span className="text-2xl font-bold">{formatDate(event.date)}</span>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                              config.bgColor,
                              "text-foreground"
                            )}
                          >
                            <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
                            {config.label}
                          </span>
                          {event.endDate && (
                            <span className="text-xs text-muted-foreground">
                              até {formatDate(event.endDate)} {formatMonth(event.endDate)}
                            </span>
                          )}
                        </div>

                        <h4 className="font-semibold text-foreground group-hover:text-primary">
                          {event.title}
                        </h4>

                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          {event.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {event.time}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
