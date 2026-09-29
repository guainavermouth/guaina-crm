import { useEffect, useRef, useState } from 'react'
import { CATEGORIAS, RESPONSABLES, STATUSES, RELEVANCIAS } from '../types'

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  categorias: string[]
  onCategoriasChange: (value: string[]) => void
  responsables: string[]
  onResponsablesChange: (value: string[]) => void
  statuses: string[]
  onStatusesChange: (value: string[]) => void
  relevancias: string[]
  onRelevanciasChange: (value: string[]) => void
  onAddLead: () => void
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

const relevanciaLabels: Record<string, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  formatOption,
  open,
  onOpenChange,
}: {
  label: string
  options: readonly string[]
  selected: string[]
  onChange: (next: string[]) => void
  formatOption?: (value: string) => string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onOpenChange])

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const summary =
    selected.length === 0
      ? label
      : selected.length === 1
        ? (formatOption ? formatOption(selected[0]) : selected[0])
        : `${label} (${selected.length})`

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 bg-canvas text-sm rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:bg-[#ebe6de] transition-colors focus-visible:ring-2 focus-visible:ring-terracota/20 ${
          selected.length > 0 ? 'text-ink font-medium' : 'text-ink/80'
        }`}
      >
        <span className="max-w-[140px] truncate">{summary}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-[220px] max-h-64 overflow-auto custom-scrollbar rounded-xl border border-line bg-white shadow-lg p-1.5">
          <div className="flex items-center justify-between px-2 py-1.5 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-[11px] font-semibold text-terracota hover:underline cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>
          <ul role="listbox" aria-multiselectable="true" className="space-y-0.5">
            {options.map((opt) => {
              const checked = selected.includes(opt)
              return (
                <li key={opt}>
                  <label className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-ink cursor-pointer hover:bg-canvas">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(opt)}
                      className="w-3.5 h-3.5 rounded border-line text-terracota focus:ring-terracota/30 cursor-pointer"
                    />
                    <span>{formatOption ? formatOption(opt) : opt}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function FilterBar({
  search,
  onSearchChange,
  categorias,
  onCategoriasChange,
  responsables,
  onResponsablesChange,
  statuses,
  onStatusesChange,
  relevancias,
  onRelevanciasChange,
  onAddLead,
}: FilterBarProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  return (
    <div className="card-base p-3 sm:p-3.5 overflow-visible">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 min-w-[180px]">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar leads..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-canvas text-sm text-ink/80 rounded-xl pl-10 pr-4 py-2.5 outline-none border border-transparent placeholder:text-muted/60 focus:ring-2 focus:ring-terracota/20 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <MultiSelect
            label="Categorías"
            options={CATEGORIAS}
            selected={categorias}
            onChange={onCategoriasChange}
            open={openFilter === 'categorias'}
            onOpenChange={(v) => setOpenFilter(v ? 'categorias' : null)}
          />
          <MultiSelect
            label="Relevancia"
            options={RELEVANCIAS}
            selected={relevancias}
            onChange={onRelevanciasChange}
            formatOption={(v) => relevanciaLabels[v] || v}
            open={openFilter === 'relevancia'}
            onOpenChange={(v) => setOpenFilter(v ? 'relevancia' : null)}
          />
          <MultiSelect
            label="Responsables"
            options={RESPONSABLES}
            selected={responsables}
            onChange={onResponsablesChange}
            open={openFilter === 'responsables'}
            onOpenChange={(v) => setOpenFilter(v ? 'responsables' : null)}
          />
          <MultiSelect
            label="Estados"
            options={STATUSES}
            selected={statuses}
            onChange={onStatusesChange}
            open={openFilter === 'estados'}
            onOpenChange={(v) => setOpenFilter(v ? 'estados' : null)}
          />
        </div>

        <button type="button" onClick={onAddLead} className="btn-primary shrink-0 self-start sm:self-auto sm:ml-auto">
          <PlusIcon />
          <span className="hidden sm:inline">Agregar Lead</span>
          <span className="sm:hidden">Agregar</span>
        </button>
      </div>
    </div>
  )
}
