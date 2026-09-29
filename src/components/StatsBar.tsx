import type { Lead } from '../types'
import { STATUSES } from '../types'

interface StatsBarProps {
  leads: Lead[]
}

const statusDotColors: Record<string, string> = {
  Pendiente: 'bg-slate-400',
  Contactado: 'bg-blue-500',
  Interesado: 'bg-amber-500',
  'Reunión Coordinada': 'bg-orange-500',
  Cliente: 'bg-emerald-500',
  Descartado: 'bg-red-500',
}

export default function StatsBar({ leads }: StatsBarProps) {
  const totalLeads = leads.length

  return (
    <div className="flex gap-2.5 overflow-x-auto custom-scrollbar touch-pan-x pb-0.5 -mx-1 px-1 lg:grid lg:grid-cols-7 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
      <div className="card-base px-3.5 py-3 shrink-0 w-[7.5rem] lg:w-auto">
        <p className="table-header mb-1">Total</p>
        <p className="text-xl font-bold text-ink">{totalLeads}</p>
      </div>

      {STATUSES.map((status) => {
        const count = leads.filter((l) => l.status === status).length
        return (
          <div key={status} className="card-base px-3.5 py-3 shrink-0 w-[7.5rem] lg:w-auto">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full shrink-0 ${statusDotColors[status]}`} />
              <p className="table-header truncate">{status}</p>
            </div>
            <p className="text-xl font-bold text-ink">{count}</p>
          </div>
        )
      })}
    </div>
  )
}
