import PitchCards from '../components/PitchCards'
import SalesTools from '../components/SalesTools'

export default function PitchesPage() {
  return (
    <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Pitches</h1>
        <p className="text-sm text-muted mt-0.5">
          Herramientas comerciales, negociación y mensajes de presentación
        </p>
      </div>

      <div className="mb-10">
        <SalesTools />
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-ink tracking-tight">Mensajes</h2>
          <p className="text-sm text-muted mt-0.5">
            Pitches por canal listos para copiar
          </p>
        </div>
        <PitchCards />
      </div>
    </div>
  )
}
