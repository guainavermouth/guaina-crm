import { useEffect, useState } from 'react'
import type { Lead } from '../types'
import { PITCHES, customizePitch, suggestedPitchId } from '../data/pitches'
import { extractInstagramUsername, instagramDmUrl } from '../lib/instagram'

interface SendPitchModalProps {
  lead: Lead
  onClose: () => void
}

export default function SendPitchModal({ lead, onClose }: SendPitchModalProps) {
  const username = extractInstagramUsername(lead.redes_sociales)
  const [pitchId, setPitchId] = useState(() => suggestedPitchId(lead.categoria))
  const [contactName, setContactName] = useState(
    () => lead.posible_contacto?.trim() || lead.nombre || ''
  )
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const pitch = PITCHES.find((p) => p.id === pitchId) ?? PITCHES[0]
  const message = customizePitch(pitch, contactName)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSend = async () => {
    if (!username) {
      setErrorMsg('Este lead no tiene un @ de Instagram válido en Redes.')
      setStatus('error')
      return
    }

    try {
      await navigator.clipboard.writeText(message)
      setStatus('copied')
      window.open(instagramDmUrl(username), '_blank', 'noopener,noreferrer')
    } catch {
      setErrorMsg('No se pudo copiar el pitch. Probá de nuevo.')
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-labelledby="send-pitch-title"
        className="w-full max-w-lg max-h-[90dvh] overflow-auto custom-scrollbar rounded-2xl bg-white shadow-xl border border-line"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-line px-5 py-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="send-pitch-title" className="text-lg font-bold text-ink tracking-tight">
              Enviar por Instagram
            </h2>
            <p className="text-sm text-muted mt-0.5 truncate">
              {lead.nombre}
              {username ? (
                <span className="text-terracota"> · @{username}</span>
              ) : (
                <span className="text-red-500"> · sin @ en Redes</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-lg text-muted hover:bg-canvas cursor-pointer focus-visible:ring-2 focus-visible:ring-terracota/20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
              Elegí el pitch
            </p>
            <div className="space-y-1.5">
              {PITCHES.map((p) => {
                const selected = p.id === pitchId
                const suggested = p.id === suggestedPitchId(lead.categoria)
                return (
                  <label
                    key={p.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selected
                        ? 'border-terracota/40 bg-terracota/5'
                        : 'border-line hover:bg-canvas'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pitch"
                      checked={selected}
                      onChange={() => {
                        setPitchId(p.id)
                        setStatus('idle')
                      }}
                      className="mt-1 text-terracota focus:ring-terracota/30 cursor-pointer"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-ink">{p.title}</span>
                        {suggested && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-terracota bg-terracota/10 px-1.5 py-0.5 rounded">
                            Sugerido
                          </span>
                        )}
                      </span>
                      <span className="block text-xs text-muted mt-0.5">{p.subtitle}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {pitch.placeholderName && (
            <div>
              <label className="table-header block mb-1.5" htmlFor="pitch-contact-name">
                Nombre del contacto
              </label>
              <input
                id="pitch-contact-name"
                type="text"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value)
                  setStatus('idle')
                }}
                placeholder="Escribí el nombre..."
                className="w-full bg-canvas text-sm text-ink rounded-xl px-3 py-2.5 outline-none border border-transparent focus:ring-2 focus:ring-terracota/20"
              />
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
              Vista previa
            </p>
            <blockquote className="text-sm text-ink/80 leading-relaxed whitespace-pre-line border-l-[3px] border-terracota/20 pl-4 max-h-48 overflow-auto custom-scrollbar bg-canvas/60 rounded-r-xl py-3 pr-3">
              {message}
            </blockquote>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Instagram no deja prellenar el DM. Copiamos el pitch al portapapeles y abrimos el chat:
            pegá con ⌘V / Ctrl+V.
          </p>

          {status === 'error' && (
            <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
          )}
          {status === 'copied' && (
            <p className="text-sm text-emerald-600 font-medium">
              Pitch copiado. Pegalo en el DM de Instagram.
            </p>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-line px-5 py-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-muted hover:text-ink px-3 py-2.5 rounded-xl hover:bg-canvas cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!username}
            className="btn-primary disabled:opacity-40 disabled:pointer-events-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Copiar y abrir DM
          </button>
        </div>
      </div>
    </div>
  )
}
