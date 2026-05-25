import { useState } from 'react'
import type { LeadInsert } from '../types'
import { CATEGORIAS, RESPONSABLES, STATUSES } from '../types'

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (lead: LeadInsert) => void
}

const inputClasses =
  'w-full bg-slate-50 text-sm text-slate-700 rounded-xl px-4 py-2.5 outline-none border-0 placeholder:text-slate-300 focus:ring-2 focus:ring-terracota/20 transition-colors'
const labelClasses =
  'table-header block mb-1.5'

const emptyLead: LeadInsert = {
  nombre: '',
  categoria: '',
  redes_sociales: '',
  posible_contacto: '',
  telefono: '',
  email: '',
  descripcion: '',
  responsable: null,
  status: 'Pendiente',
  notas: '',
}

export default function LeadModal({ isOpen, onClose, onSave }: LeadModalProps) {
  const [form, setForm] = useState<LeadInsert>({ ...emptyLead })

  if (!isOpen) return null

  const handleChange = (field: keyof LeadInsert, value: string | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
    setForm({ ...emptyLead })
  }

  const handleClose = () => {
    setForm({ ...emptyLead })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Agregar Nuevo Lead</h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className={labelClasses}>Nombre</label>
              <input
                type="text"
                placeholder="Nombre del local o contacto"
                value={form.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={inputClasses}
                required
              />
            </div>

            {/* Categoría */}
            <div>
              <label className={labelClasses}>Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                className={inputClasses}
                required
              >
                <option value="">Seleccionar categoría</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className={labelClasses}>Estado</label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className={inputClasses}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Redes Sociales */}
            <div>
              <label className={labelClasses}>Redes Sociales</label>
              <input
                type="text"
                placeholder="@instagram, link..."
                value={form.redes_sociales}
                onChange={(e) => handleChange('redes_sociales', e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Posible Contacto */}
            <div>
              <label className={labelClasses}>Posible Contacto</label>
              <input
                type="text"
                placeholder="Nombre de la persona"
                value={form.posible_contacto}
                onChange={(e) => handleChange('posible_contacto', e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className={labelClasses}>Teléfono</label>
              <input
                type="tel"
                placeholder="+54 11 ..."
                value={form.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClasses}>Email</label>
              <input
                type="email"
                placeholder="email@ejemplo.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Responsable */}
            <div>
              <label className={labelClasses}>Responsable</label>
              <select
                value={form.responsable || ''}
                onChange={(e) => handleChange('responsable', e.target.value || null)}
                className={inputClasses}
              >
                <option value="">Sin asignar</option>
                {RESPONSABLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className={labelClasses}>Descripción</label>
              <textarea
                placeholder="Descripción del lead..."
                value={form.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                className={`${inputClasses} resize-none`}
                rows={2}
              />
            </div>

            {/* Notas */}
            <div className="md:col-span-2">
              <label className={labelClasses}>Notas</label>
              <textarea
                placeholder="Notas adicionales..."
                value={form.notas}
                onChange={(e) => handleChange('notas', e.target.value)}
                className={`${inputClasses} resize-none`}
                rows={2}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
