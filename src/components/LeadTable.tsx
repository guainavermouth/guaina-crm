import { useState, useRef, useEffect } from 'react'
import type { Lead } from '../types'
import { CATEGORIAS, RESPONSABLES, STATUSES, RELEVANCIAS } from '../types'
import StatusBadge from './StatusBadge'
import RelevanciaBadge from './RelevanciaBadge'

interface LeadTableProps {
  leads: Lead[]
  onUpdate: (id: string, field: keyof Lead, value: string) => void
  onDelete: (id: string, nombre: string) => void
  loading: boolean
}

interface EditingCell {
  id: string
  field: keyof Lead
}

type SortDir = 'asc' | 'desc'
interface SortState {
  key: keyof Lead
  dir: SortDir
}

const columns: { key: keyof Lead; label: string; type: 'text' | 'select'; options?: readonly string[]; sortable: boolean }[] = [
  { key: 'nombre', label: 'Nombre', type: 'text', sortable: true },
  { key: 'categoria', label: 'Categoría', type: 'select', options: CATEGORIAS, sortable: true },
  { key: 'relevancia', label: 'Relevancia', type: 'select', options: RELEVANCIAS, sortable: true },
  { key: 'redes_sociales', label: 'Redes', type: 'text', sortable: false },
  { key: 'telefono', label: 'Teléfono', type: 'text', sortable: false },
  { key: 'email', label: 'Email', type: 'text', sortable: false },
  { key: 'responsable', label: 'Responsable', type: 'select', options: RESPONSABLES, sortable: true },
  { key: 'status', label: 'Estado', type: 'select', options: STATUSES, sortable: true },
  { key: 'notas', label: 'Notas', type: 'text', sortable: false },
]

const relevanciaOrder: Record<string, number> = { alta: 0, media: 1, baja: 2 }

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className={`inline-flex flex-col ml-1 ${active ? 'text-[#AA422F]' : 'text-slate-300'}`}>
      <svg className={`w-2.5 h-2.5 ${active && dir === 'asc' ? 'text-[#AA422F]' : ''}`} viewBox="0 0 10 6" fill="currentColor">
        <path d="M5 0L10 6H0L5 0Z" />
      </svg>
      <svg className={`w-2.5 h-2.5 -mt-0.5 ${active && dir === 'desc' ? 'text-[#AA422F]' : ''}`} viewBox="0 0 10 6" fill="currentColor">
        <path d="M5 6L0 0H10L5 6Z" />
      </svg>
    </span>
  )
}

function EditableInput({
  value,
  onSave,
  onCancel,
}: {
  value: string
  onSave: (val: string) => void
  onCancel: () => void
}) {
  const [inputValue, setInputValue] = useState(value || '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave(inputValue)
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={() => onSave(inputValue)}
      onKeyDown={handleKeyDown}
      className="w-full bg-white border border-[#AA422F]/30 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#AA422F]/20"
    />
  )
}

function EditableSelect({
  value,
  options,
  onSave,
  onCancel,
  allowEmpty,
}: {
  value: string
  options: readonly string[]
  onSave: (val: string) => void
  onCancel: () => void
  allowEmpty?: boolean
}) {
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    selectRef.current?.focus()
  }, [])

  return (
    <select
      ref={selectRef}
      value={value || ''}
      onChange={(e) => onSave(e.target.value)}
      onBlur={() => onCancel()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel()
      }}
      className="w-full bg-white border border-[#AA422F]/30 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#AA422F]/20 cursor-pointer"
    >
      {allowEmpty && <option value="">—</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}

function NotesCell({
  value,
  onSave,
}: {
  value: string
  onSave: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || '')
  const rootRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!open) return
    setDraft(value || '')
    setEditing(false)
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, value])

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
    }
  }, [editing])

  const preview = value?.trim()
    ? value.trim()
    : null

  const handleSave = () => {
    onSave(draft)
    setEditing(false)
    setOpen(false)
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 w-full max-w-[200px] text-left rounded-lg px-1 py-0.5 -mx-1 hover:bg-canvas cursor-pointer focus-visible:ring-2 focus-visible:ring-terracota/20 outline-none"
        aria-expanded={open}
        aria-haspopup="dialog"
        title={preview || 'Agregar nota'}
      >
        <span className="text-sm truncate flex-1 min-w-0">
          {preview || <span className="text-muted/40">—</span>}
        </span>
        <svg
          className="w-3.5 h-3.5 shrink-0 text-muted/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Nota"
          className="absolute right-0 top-full mt-1.5 z-30 w-[320px] max-w-[min(320px,calc(100vw-2rem))] rounded-xl border border-line bg-white shadow-lg p-3"
        >
          {editing ? (
            <div className="space-y-2.5">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                placeholder="Escribí la nota..."
                className="w-full resize-y min-h-[100px] bg-canvas text-sm text-ink rounded-lg px-3 py-2 outline-none border border-transparent focus:ring-2 focus:ring-terracota/20"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDraft(value || '')
                    setEditing(false)
                  }}
                  className="text-xs font-semibold text-muted hover:text-ink px-2.5 py-1.5 rounded-lg hover:bg-canvas cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="text-xs font-semibold text-white bg-terracota hover:bg-terracota/90 px-3 py-1.5 rounded-lg cursor-pointer active:scale-[0.98]"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-sm text-ink/90 whitespace-pre-wrap break-words leading-relaxed max-h-48 overflow-auto custom-scrollbar">
                {preview || <span className="text-muted/50 italic">Sin notas</span>}
              </p>
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-line">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold text-muted hover:text-ink px-2.5 py-1.5 rounded-lg hover:bg-canvas cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-xs font-semibold text-terracota hover:bg-terracota/5 px-2.5 py-1.5 rounded-lg cursor-pointer"
                >
                  Editar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function LeadTable({ leads, onUpdate, onDelete, loading }: LeadTableProps) {
  const [editing, setEditing] = useState<EditingCell | null>(null)
  const [sort, setSort] = useState<SortState>({ key: 'nombre', dir: 'asc' })
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleSort = (key: keyof Lead) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    )
  }

  const sortedLeads = [...leads].sort((a, b) => {
    if (sort.key === 'relevancia') {
      const aVal = relevanciaOrder[String(a.relevancia || '').toLowerCase()] ?? 99
      const bVal = relevanciaOrder[String(b.relevancia || '').toLowerCase()] ?? 99
      return sort.dir === 'asc' ? aVal - bVal : bVal - aVal
    }
    const aVal = String(a[sort.key] || '').toLowerCase()
    const bVal = String(b[sort.key] || '').toLowerCase()
    const cmp = aVal.localeCompare(bVal, 'es')
    return sort.dir === 'asc' ? cmp : -cmp
  })

  const handleSave = (id: string, field: keyof Lead, value: string) => {
    const lead = leads.find((l) => l.id === id)
    const currentValue = lead ? String(lead[field] || '') : ''
    if (value !== currentValue) {
      onUpdate(id, field, value)
    }
    setEditing(null)
  }

  const handleCancel = () => {
    setEditing(null)
  }

  const startEditing = (id: string, field: keyof Lead) => {
    setEditing({ id, field })
  }

  if (loading) {
    return (
      <div className="card-base h-full p-12 flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium">Cargando leads...</span>
        </div>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="card-base h-full p-12 flex flex-col items-center justify-center text-muted">
        <svg className="w-12 h-12 mb-3 text-line" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p className="text-sm font-medium">No hay leads para mostrar</p>
        <p className="text-xs mt-1">Agregá un nuevo lead para empezar</p>
      </div>
    )
  }

  return (
    <div className="card-base h-full min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1000px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#faf8f5]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`table-header text-left px-4 py-3 border-b border-line bg-[#faf8f5] ${
                    col.sortable ? 'cursor-pointer hover:text-ink select-none' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center">
                    {col.label}
                    {col.sortable && (
                      <SortIcon active={sort.key === col.key} dir={sort.dir} />
                    )}
                  </span>
                </th>
              ))}
              <th className="table-header text-left px-2 py-3 border-b border-line bg-[#faf8f5] w-10" />
            </tr>
          </thead>
          <tbody>
            {sortedLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-[#faf8f5]/80 transition-colors group">
                {columns.map((col) => {
                  const isEditing =
                    editing?.id === lead.id && editing?.field === col.key
                  const cellValue = String(lead[col.key] || '')

                  return (
                    <td key={col.key} className="table-cell">
                      {col.key === 'notas' ? (
                        <NotesCell
                          value={cellValue}
                          onSave={(val) => handleSave(lead.id, 'notas', val)}
                        />
                      ) : isEditing ? (
                        col.type === 'select' ? (
                          <EditableSelect
                            value={cellValue}
                            options={col.options!}
                            onSave={(val) => handleSave(lead.id, col.key, val)}
                            onCancel={handleCancel}
                            allowEmpty={col.key === 'responsable' || col.key === 'relevancia'}
                          />
                        ) : (
                          <EditableInput
                            value={cellValue}
                            onSave={(val) => handleSave(lead.id, col.key, val)}
                            onCancel={handleCancel}
                          />
                        )
                      ) : (
                        <div
                          className="editable-cell"
                          onClick={() => startEditing(lead.id, col.key)}
                        >
                          {col.key === 'status' ? (
                            <StatusBadge status={cellValue} />
                          ) : col.key === 'relevancia' ? (
                            <RelevanciaBadge relevancia={cellValue} />
                          ) : col.key === 'redes_sociales' && cellValue ? (
                            <span className="text-terracota text-sm truncate block max-w-[150px]">
                              {cellValue}
                            </span>
                          ) : (
                            <span className="text-sm truncate block max-w-[200px]">
                              {cellValue || <span className="text-muted/40">—</span>}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  )
                })}
                <td className="px-2 py-2 w-10">
                  {confirmDelete === lead.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => { onDelete(lead.id, lead.nombre); setConfirmDelete(null) }}
                        className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="text-[10px] font-bold text-muted bg-canvas hover:bg-line rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(lead.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted/50 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                      title="Eliminar lead"
                      aria-label={`Eliminar ${lead.nombre}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
