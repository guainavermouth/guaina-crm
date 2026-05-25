import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead } from '../types'
import { RESPONSABLES } from '../types'
import KanbanBoard from '../components/KanbanBoard'

export default function KanbanPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterResponsable, setFilterResponsable] = useState('')

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al cargar leads:', error)
    } else {
      setLeads(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error al actualizar estado:', error)
      return
    }

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? { ...lead, status: newStatus, updated_at: new Date().toISOString() }
          : lead
      )
    )
  }

  const filteredLeads = filterResponsable
    ? leads.filter((l) => l.responsable === filterResponsable)
    : leads

  return (
    <div>
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Tablero</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Vista Kanban del pipeline de ventas
        </p>
      </div>

      {/* Responsable filter pills */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1">
          Responsable:
        </span>
        <button
          onClick={() => setFilterResponsable('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterResponsable === ''
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Todos
        </button>
        {RESPONSABLES.map((r) => (
          <button
            key={r}
            onClick={() => setFilterResponsable(r === filterResponsable ? '' : r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterResponsable === r
                ? 'bg-[#AA422F] text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card-base p-12 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium">Cargando tablero...</span>
          </div>
        </div>
      ) : (
        <KanbanBoard leads={filteredLeads} onStatusChange={handleStatusChange} />
      )}
    </div>
  )
}
