import { useState, useEffect } from 'react'
import { PITCHES, customizePitch, type Pitch } from '../data/pitches'

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
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

export default function PitchCards() {
  const [names, setNames] = useState<Record<number, string>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const getCustomizedText = (pitch: Pitch) =>
    customizePitch(pitch, names[pitch.id])

  const handleCopy = async (pitch: Pitch) => {
    const text = getCustomizedText(pitch)
    try {
      await navigator.clipboard.writeText(text)
      setToast('¡Copiado!')
      setCopiedId(pitch.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setToast('Error al copiar')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PITCHES.map((pitch) => (
          <div key={pitch.id} className="card-base flex flex-col">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{pitch.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{pitch.subtitle}</p>
                </div>
                <span className="text-[10px] font-bold text-terracota bg-terracota/5 px-2 py-1 rounded-full">
                  #{pitch.id}
                </span>
              </div>

              {pitch.placeholderName && (
                <div className="mt-3">
                  <label className="table-header block mb-1.5">Nombre del contacto</label>
                  <input
                    type="text"
                    placeholder="Escribí el nombre..."
                    value={names[pitch.id] || ''}
                    onChange={(e) =>
                      setNames((prev) => ({ ...prev, [pitch.id]: e.target.value }))
                    }
                    className="w-full bg-slate-50 text-sm text-slate-600 rounded-xl px-3 py-2 outline-none border-0 placeholder:text-slate-300 focus:ring-2 focus:ring-terracota/20 transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar max-h-[400px]">
              <blockquote className="text-sm text-slate-600 leading-relaxed whitespace-pre-line border-l-[3px] border-terracota/20 pl-4">
                {getCustomizedText(pitch)}
              </blockquote>
            </div>

            <div className="px-6 py-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleCopy(pitch)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  copiedId === pitch.id
                    ? 'bg-emerald-500 text-white'
                    : 'btn-primary'
                }`}
              >
                {copiedId === pitch.id ? (
                  <>
                    <CheckIcon />
                    Copiado
                  </>
                ) : (
                  <>
                    <CopyIcon />
                    Copiar Pitch
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
