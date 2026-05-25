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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
      {/* Total card */}
      <div className="card-base p-4">
        <p className="table-header mb-1">Total</p>
        <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
      </div>

      {/* Status cards */}
      {STATUSES.map((status) => {
        const count = leads.filter((l) => l.status === status).length
        return (
          <div key={status} className="card-base p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${statusDotColors[status]}`} />
              <p className="table-header">{status}</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{count}</p>
          </div>
        )
      })}
    </div>
  )
}
