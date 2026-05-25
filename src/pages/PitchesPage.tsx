import PitchCards from '../components/PitchCards'

export default function PitchesPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pitches</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Mensajes de presentación para diferentes tipos de clientes
        </p>
      </div>

      <PitchCards />
    </div>
  )
}
