interface RelevanciaBadgeProps {
  relevancia: string | null | undefined
}

const styles: Record<string, string> = {
  alta: 'badge-relevancia-alta',
  media: 'badge-relevancia-media',
  baja: 'badge-relevancia-baja',
}

const labels: Record<string, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export default function RelevanciaBadge({ relevancia }: RelevanciaBadgeProps) {
  if (!relevancia) {
    return <span className="text-muted/40 text-sm">—</span>
  }

  const key = relevancia.toLowerCase()
  return <span className={`badge ${styles[key] || 'badge-pendiente'}`}>{labels[key] || relevancia}</span>
}
