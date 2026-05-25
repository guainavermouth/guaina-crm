import { useState, useRef, useEffect } from 'react'
import type { Lead } from '../types'
import { CATEGORIAS, RESPONSABLES, STATUSES } from '../types'
import StatusBadge from './StatusBadge'

interface LeadTableProps {
  leads: Lead[]
  onUpdate: (id: string, field: keyof Lead, value: string) => void
  loading: boolean
}

interface EditingCell {
  id: string
  field: keyof Lead
}

const columns: { key: keyof Lead; label: string; type: 'text' | 'select'; options?: readonly string[] }[] = [
  { key: 'nombre', label: 'Nombre', type: 'text' },
  { key: 'categoria', label: 'Categoría', type: 'select', options: CATEGORIAS },
  { key: 'redes_sociales', label: 'Redes', type: 'text' },
  { key: 'telefono', label: 'Teléfono', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'responsable', label: 'Responsable', type: 'select', options: RESPONSABLES },
  { key: 'status', label: 'Estado', type: 'select', options: STATUSES },
  { key: 'notas', label: 'Notas', type: 'text' },
]

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
      className="w-full bg-white border border-terracota/30 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-terracota/20"
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
      className="w-full bg-white border border-terracota/30 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-terracota/20 cursor-pointer"
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

export default function LeadTable({ leads, onUpdate, loading }: LeadTableProps) {
  const [editing, setEditing] = useState<EditingCell | null>(null)

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
      <div className="card-base p-12 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
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
      <div className="card-base p-12 flex flex-col items-center justify-center text-slate-400">
        <svg className="w-12 h-12 mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p className="text-sm font-medium">No hay leads para mostrar</p>
        <p className="text-xs mt-1">Agregá un nuevo lead para empezar</p>
      </div>
    )
  }

  return (
    <div className="card-base overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="table-header text-left px-4 py-3 sticky top-0 bg-slate-50/80 backdrop-blur-sm"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((col) => {
                  const isEditing =
                    editing?.id === lead.id && editing?.field === col.key
                  const cellValue = String(lead[col.key] || '')

                  return (
                    <td key={col.key} className="table-cell">
                      {isEditing ? (
                        col.type === 'select' ? (
                          <EditableSelect
                            value={cellValue}
                            options={col.options!}
                            onSave={(val) => handleSave(lead.id, col.key, val)}
                            onCancel={handleCancel}
                            allowEmpty={col.key === 'responsable'}
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
                          ) : col.key === 'redes_sociales' && cellValue ? (
                            <span className="text-terracota text-sm truncate block max-w-[150px]">
                              {cellValue}
                            </span>
                          ) : (
                            <span className="text-sm truncate block max-w-[200px]">
                              {cellValue || <span className="text-slate-300">—</span>}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
