import type { Lead } from '../types'

interface StatusBadgeProps {
  status: string
}

const statusStyles: Record<string, string> = {
  Pendiente: 'badge-pendiente',
  Contactado: 'badge-contactado',
  Interesado: 'badge-interesado',
  'Reunión Coordinada': 'badge-reunion',
  Cliente: 'badge-cliente',
  Descartado: 'badge-descartado',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const className = statusStyles[status] || 'badge-pendiente'

  return <span className={`badge ${className}`}>{status}</span>
}
