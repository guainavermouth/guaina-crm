import type { Lead } from '../types'
import { STATUSES } from '../types'
import StatusBadge from './StatusBadge'

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
  'Almacen Boutique': 'bg-crema text-verde-bosque',
  'Wine Bar': 'bg-rosa-malva/30 text-slate-700',
  Vermuteria: 'bg-terracota/10 text-terracota',
  'Cocktail Bar': 'bg-verde-salvia/30 text-verde-bosque',
  Restaurante: 'bg-blue-50 text-blue-700',
  Vinoteca: 'bg-purple-50 text-purple-700',
  'Hotel Bar': 'bg-amber-50 text-amber-700',
  Distribuidor: 'bg-slate-100 text-slate-600',
}

export default function KanbanBoard({ leads, onStatusChange }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4">
      {STATUSES.map((status) => {
        const columnLeads = leads.filter((l) => l.status === status)

        return (
          <div
            key={status}
            className={`flex-shrink-0 w-72 rounded-2xl border border-slate-100 border-t-[3px] ${columnBorderColors[status]} bg-white`}
          >
            {/* Column header */}
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="table-header">{status}</h3>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${columnBgColors[status]} text-slate-600`}
                >
                  {columnLeads.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="p-3 space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar">
              {columnLeads.length === 0 && (
                <div className="text-center py-8 text-slate-300">
                  <p className="text-xs font-medium">Sin leads</p>
                </div>
              )}

              {columnLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-xl border border-slate-100 p-3.5 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Lead name */}
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 truncate">
                    {lead.nombre}
                  </h4>

                  {/* Categoria badge */}
                  {lead.categoria && (
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${
                        categoriaBadgeColors[lead.categoria] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lead.categoria}
                    </span>
                  )}

                  {/* Details */}
                  <div className="space-y-1.5 mb-3">
                    {lead.responsable && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <span>{lead.responsable}</span>
                      </div>
                    )}
                    {lead.redes_sociales && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                        <span className="truncate">{lead.redes_sociales}</span>
                      </div>
                    )}
                  </div>

                  {/* Move to dropdown */}
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead.id, e.target.value)}
                    className="w-full text-[11px] bg-slate-50 text-slate-500 rounded-lg px-2 py-1.5 outline-none border-0 cursor-pointer hover:bg-slate-100 transition-colors focus:ring-1 focus:ring-terracota/20"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s === lead.status ? `✓ ${s}` : `→ ${s}`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
