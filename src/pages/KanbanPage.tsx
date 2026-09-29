import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead } from '../types'
import { RESPONSABLES } from '../types'
import KanbanBoard from '../components/KanbanBoard'

export default function KanbanPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterResponsable, setFilterResponsable] = useState('')
  const [searchNombre, setSearchNombre] = useState('')

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

  const filteredLeads = leads.filter((l) => {
    const matchesResponsable =
      !filterResponsable || l.responsable === filterResponsable
    const q = searchNombre.trim().toLowerCase()
    const matchesNombre = !q || l.nombre.toLowerCase().includes(q)
    return matchesResponsable && matchesNombre
  })

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Tablero</h1>
        <p className="text-sm text-muted mt-0.5">
          Vista Kanban del pipeline de ventas
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap shrink-0">
        <div className="relative w-full sm:min-w-[200px] sm:flex-1 sm:max-w-xs">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <input
            type="search"
            placeholder="Buscar por nombre..."
            value={searchNombre}
            onChange={(e) => setSearchNombre(e.target.value)}
            className="w-full bg-white text-sm text-ink rounded-xl pl-10 pr-3 py-2.5 outline-none border border-line placeholder:text-muted/60 focus:ring-2 focus:ring-terracota/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-0.5 -mx-1 px-1 touch-pan-x">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider mr-1 shrink-0">
            Responsable:
          </span>
          <button
            type="button"
            onClick={() => setFilterResponsable('')}
            className={`shrink-0 px-3 py-2 min-h-11 sm:min-h-0 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterResponsable === ''
                ? 'bg-ink text-white'
                : 'bg-white text-muted border border-line hover:bg-canvas'
            }`}
          >
            Todos
          </button>
          {RESPONSABLES.map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setFilterResponsable(r === filterResponsable ? '' : r)}
              className={`shrink-0 px-3 py-2 min-h-11 sm:min-h-0 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterResponsable === r
                  ? 'bg-terracota text-white'
                  : 'bg-white text-muted border border-line hover:bg-canvas'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {loading ? (
          <div className="card-base h-full p-12 flex items-center justify-center">
            <div className="flex items-center gap-3 text-muted">
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
    </div>
  )
}
