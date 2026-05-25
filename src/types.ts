export interface Lead {
  id: string
  nombre: string
  categoria: string
  redes_sociales: string
  posible_contacto: string
  telefono: string
  email: string
  descripcion: string
  responsable: string | null
  status: string
  notas: string
  created_at: string
  updated_at: string
}

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'>

export const CATEGORIAS = [
  'Almacen Boutique',
  'Wine Bar',
  'Vermuteria',
  'Cocktail Bar',
  'Restaurante',
  'Vinoteca',
  'Hotel Bar',
  'Distribuidor',
] as const

export const RESPONSABLES = ['Santi', 'Fer', 'Mamá', 'Abe'] as const

export const STATUSES = [
  'Pendiente',
  'Contactado',
  'Interesado',
  'Reunión Coordinada',
  'Cliente',
  'Descartado',
] as const

export type Categoria = (typeof CATEGORIAS)[number]
export type Responsable = (typeof RESPONSABLES)[number]
export type Status = (typeof STATUSES)[number]
