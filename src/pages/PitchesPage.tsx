import { ArrowDownTrayIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import PitchCards from '../components/PitchCards'

export default function PitchesPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pitches</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Mensajes de presentación y materiales comerciales
        </p>
      </div>

      {/* Ficha Técnica Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#AA422F]/10 flex items-center justify-center flex-shrink-0">
            <DocumentTextIcon className="w-6 h-6 text-[#AA422F]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              Material Comercial
            </h2>
            <h3 className="text-lg font-bold text-slate-900">Ficha Técnica — Bares</h3>
            <p className="text-sm text-slate-500 mt-1">
              PDF con la ficha técnica de Guaina Vermouth para compartir con bares, vinotecas y distribuidores.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="/ficha-tecnica.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 font-semibold text-sm"
            >
              <EyeIcon className="w-4 h-4" />
              Ver
            </a>
            <a
              href="/ficha-tecnica.pdf"
              download="Ficha Técnica - Guaina Vermouth.pdf"
              className="px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all flex items-center gap-2 font-semibold text-sm"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Descargar
            </a>
          </div>
        </div>
      </div>

      <PitchCards />
    </div>
  )
}
