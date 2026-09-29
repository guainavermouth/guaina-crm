import { useState } from 'react'
import type { Lead } from '../types'
import { STATUSES } from '../types'

interface KanbanBoardProps {
  leads: Lead[]
  onStatusChange: (id: string, newStatus: string) => void
}

const columnBorderColors: Record<string, string> = {
  Pendiente: 'border-t-slate-400',
  Contactado: 'border-t-blue-500',
  Interesado: 'border-t-amber-500',
  'Reunión Coordinada': 'border-t-orange-500',
  Cliente: 'border-t-emerald-500',
  Descartado: 'border-t-red-500',
}

const columnBgColors: Record<string, string> = {
  Pendiente: 'bg-slate-50',
  Contactado: 'bg-blue-50',
  Interesado: 'bg-amber-50',
  'Reunión Coordinada': 'bg-orange-50',
  Cliente: 'bg-emerald-50',
  Descartado: 'bg-red-50',
}

const categoriaBadgeColors: Record<string, string> = {
  'Almacen Boutique': 'bg-[#EBE7D9] text-[#3F513C]',
  'Wine Bar': 'bg-[#CEBCBD]/30 text-slate-700',
  Vermuteria: 'bg-[#AA422F]/10 text-[#AA422F]',
  'Cocktail Bar': 'bg-[#B3B99B]/30 text-[#3F513C]',
  Restaurante: 'bg-blue-50 text-blue-700',
  Vinoteca: 'bg-purple-50 text-purple-700',
  'Hotel Bar': 'bg-amber-50 text-amber-700',
  Distribuidor: 'bg-slate-100 text-slate-600',
}

export default function KanbanBoard({ leads, onStatusChange }: KanbanBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedId(leadId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', leadId)
    const el = e.currentTarget as HTMLElement
    setTimeout(() => {
      el.style.opacity = '0.4'
    }, 0)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement
    el.style.opacity = '1'
    setDraggedId(null)
    setDragOverStatus(null)
  }

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStatus(status)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null
    const currentTarget = e.currentTarget as HTMLElement
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setDragOverStatus(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain')
    if (leadId && draggedId) {
      const lead = leads.find((l) => l.id === leadId)
      if (lead && lead.status !== targetStatus) {
        onStatusChange(leadId, targetStatus)
      }
    }
    setDraggedId(null)
    setDragOverStatus(null)
  }

  return (
    <div className="flex h-full min-h-0 gap-3 overflow-x-auto overflow-y-hidden custom-scrollbar snap-x snap-mandatory touch-pan-x overscroll-x-contain pb-1">
      {STATUSES.map((status) => {
        const columnLeads = leads.filter((l) => l.status === status)
        const isDropTarget = dragOverStatus === status
        const draggedLead = draggedId ? leads.find((l) => l.id === draggedId) : null
        const isDragOrigin = draggedLead?.status === status

        return (
          <div
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
            className={`snap-start shrink-0 w-[min(85vw,18rem)] h-full min-h-0 flex flex-col rounded-2xl border border-t-[3px] transition-all duration-200 ${columnBorderColors[status]} ${
              isDropTarget && !isDragOrigin
                ? 'border-slate-300 bg-slate-50/80 shadow-md'
                : 'border-slate-100 bg-white'
            }`}
          >
            <div className="px-4 py-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] truncate">
                  {status}
                </h3>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${columnBgColors[status]} text-slate-600`}
                >
                  {columnLeads.length}
                </span>
              </div>
            </div>

            {isDropTarget && !isDragOrigin && (
              <div className="mx-3 mt-3 shrink-0 border-2 border-dashed border-[#AA422F]/30 rounded-xl p-3 text-center">
                <p className="text-[11px] text-[#AA422F]/60 font-semibold">Soltar aquí</p>
              </div>
            )}

            <div className="flex-1 min-h-0 p-3 space-y-3 overflow-y-auto custom-scrollbar overscroll-contain touch-pan-y">
              {columnLeads.length === 0 && !isDropTarget && (
                <div className="text-center py-8 text-slate-300">
                  <p className="text-xs font-medium">Sin leads</p>
                </div>
              )}

              {columnLeads.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-xl border border-slate-100 p-3.5 shadow-sm hover:shadow-md transition-all select-none md:cursor-grab md:active:cursor-grabbing ${
                    draggedId === lead.id ? 'opacity-40 scale-95' : ''
                  }`}
                >
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 truncate">
                    {lead.nombre}
                  </h4>

                  {lead.categoria && (
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${
                        categoriaBadgeColors[lead.categoria] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lead.categoria}
                    </span>
                  )}

                  <div className="space-y-1.5 mb-3">
                    {lead.responsable && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <span>{lead.responsable}</span>
                      </div>
                    )}
                    {lead.redes_sociales && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                        <span className="truncate">{lead.redes_sociales}</span>
                      </div>
                    )}
                  </div>

                  <label className="block">
                    <span className="sr-only">Mover a</span>
                    <select
                      value={lead.status}
                      onChange={(e) => onStatusChange(lead.id, e.target.value)}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="w-full min-h-11 md:min-h-0 text-[12px] md:text-[11px] bg-slate-50 text-slate-600 rounded-lg px-2.5 py-2.5 md:py-1.5 outline-none border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors focus:ring-1 focus:ring-[#AA422F]/20"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s === lead.status ? `✓ ${s}` : `→ ${s}`}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
