import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead, LeadInsert } from '../types'
import StatsBar from '../components/StatsBar'
import FilterBar from '../components/FilterBar'
import LeadTable from '../components/LeadTable'
import LeadModal from '../components/LeadModal'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [filterCategorias, setFilterCategorias] = useState<string[]>([])
  const [filterResponsables, setFilterResponsables] = useState<string[]>([])
  const [filterStatuses, setFilterStatuses] = useState<string[]>([])
  const [filterRelevancias, setFilterRelevancias] = useState<string[]>([])

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

  const handleAddLead = async (lead: LeadInsert) => {
    const { error } = await supabase.from('leads').insert([lead])

    if (error) {
      console.error('Error al agregar lead:', error)
      return
    }

    setModalOpen(false)
    fetchLeads()
  }

  const handleUpdateLead = async (id: string, field: keyof Lead, value: string) => {
    const nextValue =
      field === 'relevancia' || field === 'responsable'
        ? value || null
        : value

    const { error } = await supabase
      .from('leads')
      .update({ [field]: nextValue, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error al actualizar lead:', error)
      return
    }

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, [field]: nextValue, updated_at: new Date().toISOString() } : lead
      )
    )
  }

  const handleDeleteLead = async (id: string, nombre: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id)

    if (error) {
      console.error('Error al eliminar lead:', error)
      return
    }

    setLeads((prev) => prev.filter((lead) => lead.id !== id))
    console.log(`Lead eliminado: ${nombre}`)
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.redes_sociales?.toLowerCase().includes(search.toLowerCase()) ||
      lead.notas?.toLowerCase().includes(search.toLowerCase()) ||
      lead.posible_contacto?.toLowerCase().includes(search.toLowerCase()) ||
      lead.telefono?.toLowerCase().includes(search.toLowerCase())

    const matchesCategoria =
      filterCategorias.length === 0 || filterCategorias.includes(lead.categoria)
    const matchesResponsable =
      filterResponsables.length === 0 ||
      (!!lead.responsable && filterResponsables.includes(lead.responsable))
    // Sin filtro de estado: ocultar descartados. Si eligen estados, respetar la selección.
    const matchesStatus =
      filterStatuses.length === 0
        ? lead.status !== 'Descartado'
        : filterStatuses.includes(lead.status)
    const matchesRelevancia =
      filterRelevancias.length === 0 ||
      (!!lead.relevancia && filterRelevancias.includes(lead.relevancia))

    return matchesSearch && matchesCategoria && matchesResponsable && matchesStatus && matchesRelevancia
  })

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Leads</h1>
        <p className="text-sm text-muted mt-0.5">
          Gestión de contactos comerciales de Guaina Vermouth
        </p>
      </div>

      <div className="shrink-0">
        <StatsBar leads={leads} />
      </div>

      <div className="shrink-0">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          categorias={filterCategorias}
          onCategoriasChange={setFilterCategorias}
          responsables={filterResponsables}
          onResponsablesChange={setFilterResponsables}
          statuses={filterStatuses}
          onStatusesChange={setFilterStatuses}
          relevancias={filterRelevancias}
          onRelevanciasChange={setFilterRelevancias}
          onAddLead={() => setModalOpen(true)}
        />
      </div>

      <div className="flex-1 min-h-0">
        <LeadTable
          leads={filteredLeads}
          onUpdate={handleUpdateLead}
          onDelete={handleDeleteLead}
          loading={loading}
        />
      </div>

      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddLead}
      />
    </div>
  )
}
