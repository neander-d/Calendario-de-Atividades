"use client"

import {
  type CalendarEvent,
  categoryConfig,
  months,
} from "@/lib/calendar-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Share2, X } from "lucide-react"
import { useEffect } from "react"

interface EventModalProps {
  event: CalendarEvent | null
  onClose: () => void
}

function formatFullDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00")
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
}

export function EventModal({ event, onClose }: EventModalProps) {
  useEffect(() => {
    if (event) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [event])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  if (!event) return null

  const config = categoryConfig[event.category]

  const generateCalendarLink = () => {
    const startDate = event.date.replace(/-/g, "")
    const endDate = event.endDate?.replace(/-/g, "") || startDate
    const title = encodeURIComponent(event.title)
    const description = encodeURIComponent(event.description)
    const location = encodeURIComponent(event.location || "")
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}`
  }

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `${event.title} - ${formatFullDate(event.date)}${event.location ? ` em ${event.location}` : ""}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(
        `${event.title}\n${formatFullDate(event.date)}${event.location ? `\nLocal: ${event.location}` : ""}\n${event.description}`
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Fechar</span>
        </button>

        <div className="space-y-4">
          <div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                config.bgColor,
                "text-foreground"
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", config.color)} />
              {config.label}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">{event.title}</h2>

          <div className="space-y-3 text-muted-foreground">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 flex-shrink-0 text-primary" />
              <span>
                {formatFullDate(event.date)}
                {event.endDate && ` até ${formatFullDate(event.endDate)}`}
              </span>
            </div>

            {event.time && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>{event.time}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          <p className="text-foreground/90">{event.description}</p>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              className="flex-1"
              onClick={() => window.open(generateCalendarLink(), "_blank")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Adicionar ao Calendário
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
