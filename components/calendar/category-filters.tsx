"use client"

import { categoryConfig, type EventCategory } from "@/lib/calendar-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface CategoryFiltersProps {
  selectedCategories: EventCategory[]
  onToggleCategory: (category: EventCategory) => void
  onClearFilters: () => void
}

export function CategoryFilters({
  selectedCategories,
  onToggleCategory,
  onClearFilters,
}: CategoryFiltersProps) {
  const allCategories = Object.entries(categoryConfig) as [
    EventCategory,
    (typeof categoryConfig)[EventCategory],
  ][]

  const allSelected = selectedCategories.length === allCategories.length

  return (
    <section id="categorias" className="py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Filtrar por Categoria</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          {allSelected ? "Limpar filtros" : "Selecionar todos"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {allCategories.map(([category, config]) => {
          const isSelected = selectedCategories.includes(category)
          return (
            <button
              key={category}
              onClick={() => onToggleCategory(category)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                isSelected
                  ? `${config.bgColor} text-foreground ring-1 ring-border`
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full", config.color)} />
              {config.label}
              {isSelected && <Check className="h-3.5 w-3.5" />}
            </button>
          )
        })}
      </div>
    </section>
  )
}
