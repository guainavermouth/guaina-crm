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
  const [filterCategoria, setFilterCategoria] = useState('')
  const [filterResponsable, setFilterResponsable] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

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
    const { error } = await supabase
      .from('leads')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error al actualizar lead:', error)
      return
    }

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, [field]: value, updated_at: new Date().toISOString() } : lead
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

    const matchesCategoria = !filterCategoria || lead.categoria === filterCategoria
    const matchesResponsable = !filterResponsable || lead.responsable === filterResponsable
    const matchesStatus = !filterStatus || lead.status === filterStatus

    return matchesSearch && matchesCategoria && matchesResponsable && matchesStatus
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
          categoria={filterCategoria}
          onCategoriaChange={setFilterCategoria}
          responsable={filterResponsable}
          onResponsableChange={setFilterResponsable}
          status={filterStatus}
          onStatusChange={setFilterStatus}
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
