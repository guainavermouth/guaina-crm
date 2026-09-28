import { useEffect, useState } from 'react'
import { ArrowDownTrayIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { CANALES_NEGOCIACION, NEGOCIACION } from '../data/negociacion'

interface Material {
  id: string
  eyebrow: string
  title: string
  description: string
  href: string
  downloadName: string
}

const materials: Material[] = [
  {
    id: 'ficha',
    eyebrow: 'Producto',
    title: 'Ficha Técnica — Bares',
    description:
      'PDF con la ficha técnica de Guaina para compartir con bares, vinotecas y distribuidores.',
    href: '/ficha-tecnica.pdf',
    downloadName: 'Ficha Técnica - Guaina Vermouth.pdf',
  },
  {
    id: 'lista-dist',
    eyebrow: 'Precios',
    title: 'Lista de Precios — Distribuidores',
    description: 'Lista comercial para distribuidores y representantes.',
    href: '/lista-precios-distribuidores.pdf',
    downloadName: 'Lista de Precios - Distribuidores.pdf',
  },
  {
    id: 'lista-pdv',
    eyebrow: 'Precios',
    title: 'Lista de Precios — PdV',
    description: 'Lista comercial para puntos de venta (bares, vinotecas, almacenes).',
    href: '/lista-precios-pdv.pdf',
    downloadName: 'Lista de Precios - PdV.pdf',
  },
]

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

export default function SalesTools() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(t)
  }, [toast])

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setToast('Copiado')
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setToast('No se pudo copiar')
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-ink tracking-tight">Herramientas</h2>
          <p className="text-sm text-muted mt-0.5">
            Listas de precios, ficha técnica y marcos de negociación por canal
          </p>
        </div>

        <div className="space-y-3">
          {materials.map((m) => (
            <div key={m.id} className="card-base p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-terracota/10 flex items-center justify-center shrink-0">
                  <DocumentTextIcon className="w-5 h-5 text-terracota" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-[0.18em] mb-1">
                    {m.eyebrow}
                  </p>
                  <h3 className="text-base font-bold text-ink">{m.title}</h3>
                  <p className="text-sm text-muted mt-1">{m.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 bg-white text-ink/80 border border-line rounded-xl hover:bg-canvas transition-colors flex items-center gap-2 font-semibold text-sm cursor-pointer"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Ver
                  </a>
                  <a
                    href={m.href}
                    download={m.downloadName}
                    className="px-3.5 py-2.5 bg-ink text-white rounded-xl hover:bg-ink/90 transition-colors flex items-center gap-2 font-semibold text-sm cursor-pointer"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Descargar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-ink tracking-tight">Negociación por canal</h2>
          <p className="text-sm text-muted mt-0.5">
            Opciones listas para copiar y usar en la charla comercial
          </p>
        </div>

        <div className="space-y-6">
          {CANALES_NEGOCIACION.map((canal) => {
            const opciones = NEGOCIACION.filter((n) => n.canal === canal)
            return (
              <div key={canal}>
                <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.18em] mb-2.5">
                  {canal}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {opciones.map((op) => {
                    const copied = copiedId === op.id
                    return (
                      <div key={op.id} className="card-base p-5 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="text-sm font-bold text-ink">{op.titulo}</h4>
                            <p className="text-xs text-terracota font-medium mt-0.5">
                              {op.resumen}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-ink/75 leading-relaxed flex-1">{op.detalle}</p>
                        <blockquote className="mt-3 text-sm text-muted leading-relaxed whitespace-pre-line border-l-[3px] border-terracota/20 pl-3 py-1">
                          {op.textoCopia}
                        </blockquote>
                        <button
                          type="button"
                          onClick={() => handleCopy(op.id, op.textoCopia)}
                          className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            copied ? 'bg-emerald-500 text-white' : 'btn-primary'
                          }`}
                        >
                          {copied ? (
                            <>
                              <CheckIcon />
                              Copiado
                            </>
                          ) : (
                            <>
                              <CopyIcon />
                              Copiar para negociar
                            </>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
