import { useEffect, useState, type FormEvent } from 'react'
import type { Pitch } from '../data/pitches'
import { getDefaultPitch } from '../lib/pitchesStore'

interface EditPitchModalProps {
  pitch: Pitch
  onSave: (pitch: Pitch) => void
  onRestore: (id: number) => void
  onClose: () => void
}

export default function EditPitchModal({
  pitch,
  onSave,
  onRestore,
  onClose,
}: EditPitchModalProps) {
  const [title, setTitle] = useState(pitch.title)
  const [subtitle, setSubtitle] = useState(pitch.subtitle)
  const [text, setText] = useState(pitch.text)
  const defaults = getDefaultPitch(pitch.id)
  const isCustom =
    !!defaults &&
    (title !== defaults.title ||
      subtitle !== defaults.subtitle ||
      text !== defaults.text)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave({
      ...pitch,
      title: title.trim() || pitch.title,
      subtitle: subtitle.trim(),
      text: text.trim() || pitch.text,
    })
    onClose()
  }

  const handleRestore = () => {
    if (!defaults) return
    onRestore(pitch.id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-labelledby="edit-pitch-title"
        className="w-full max-w-lg max-h-[90dvh] overflow-auto custom-scrollbar rounded-2xl bg-white shadow-xl border border-line"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-white border-b border-line px-5 py-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 id="edit-pitch-title" className="text-lg font-bold text-ink tracking-tight">
                Editar pitch
              </h2>
              <p className="text-sm text-muted mt-0.5 truncate">#{pitch.id} · {pitch.title}</p>
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
              <label className="table-header block mb-1.5" htmlFor="pitch-title">
                Título
              </label>
              <input
                id="pitch-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-canvas text-sm text-ink rounded-xl px-3 py-2.5 outline-none border border-transparent focus:ring-2 focus:ring-terracota/20"
              />
            </div>

            <div>
              <label className="table-header block mb-1.5" htmlFor="pitch-subtitle">
                Subtítulo
              </label>
              <input
                id="pitch-subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-canvas text-sm text-ink rounded-xl px-3 py-2.5 outline-none border border-transparent focus:ring-2 focus:ring-terracota/20"
              />
            </div>

            <div>
              <label className="table-header block mb-1.5" htmlFor="pitch-text">
                Mensaje
              </label>
              <textarea
                id="pitch-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
                className="w-full resize-y min-h-[220px] bg-canvas text-sm text-ink rounded-xl px-3 py-2.5 outline-none border border-transparent focus:ring-2 focus:ring-terracota/20 leading-relaxed"
              />
              {pitch.placeholderName && (
                <p className="text-xs text-muted mt-1.5">
                  Usá <code className="text-terracota">{pitch.placeholderName}</code> donde vaya el
                  nombre del contacto.
                </p>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-line px-5 py-4 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleRestore}
              disabled={!isCustom && text === pitch.text && title === pitch.title}
              className="text-sm font-semibold text-muted hover:text-ink px-3 py-2.5 rounded-xl hover:bg-canvas cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              Restaurar original
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-semibold text-muted hover:text-ink px-3 py-2.5 rounded-xl hover:bg-canvas cursor-pointer"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
