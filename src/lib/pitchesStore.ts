import { PITCHES as DEFAULT_PITCHES, type Pitch } from '../data/pitches'
import { supabase } from './supabase'

const LOCAL_KEY = 'guaina-crm-pitches-v1'

type PitchRow = {
  id: number
  title: string
  subtitle: string
  placeholder_name: string
  body: string
  categorias: string[] | null
  updated_at?: string
}

type PitchOverride = Partial<Pick<Pitch, 'title' | 'subtitle' | 'text' | 'placeholderName'>>

function rowToPitch(row: PitchRow): Pitch {
  const base = DEFAULT_PITCHES.find((p) => p.id === row.id)
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? '',
    placeholderName: row.placeholder_name ?? '',
    text: row.body,
    categorias: row.categorias?.length ? row.categorias : base?.categorias ?? [],
  }
}

function pitchToRow(pitch: Pitch): PitchRow {
  return {
    id: pitch.id,
    title: pitch.title,
    subtitle: pitch.subtitle,
    placeholder_name: pitch.placeholderName,
    body: pitch.text,
    categorias: [...pitch.categorias],
    updated_at: new Date().toISOString(),
  }
}

function readLocalOverrides(): Record<string, PitchOverride> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, PitchOverride>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function clearLocalOverrides() {
  try {
    localStorage.removeItem(LOCAL_KEY)
  } catch {
    // ignore
  }
}

function applyLocalOverrides(pitches: Pitch[]): Pitch[] {
  const overrides = readLocalOverrides()
  if (!Object.keys(overrides).length) return pitches
  return pitches.map((pitch) => {
    const o = overrides[String(pitch.id)]
    if (!o) return pitch
    return {
      ...pitch,
      title: o.title ?? pitch.title,
      subtitle: o.subtitle ?? pitch.subtitle,
      text: o.text ?? pitch.text,
      placeholderName: o.placeholderName ?? pitch.placeholderName,
    }
  })
}

async function seedDefaults(): Promise<Pitch[]> {
  const rows = DEFAULT_PITCHES.map(pitchToRow)
  const { error } = await supabase.from('pitch_templates').upsert(rows, { onConflict: 'id' })
  if (error) throw error
  return DEFAULT_PITCHES.map((p) => ({ ...p }))
}

async function migrateLocalToSupabase(base: Pitch[]): Promise<Pitch[]> {
  const overrides = readLocalOverrides()
  const ids = Object.keys(overrides)
  if (!ids.length) return base

  const merged = applyLocalOverrides(base)
  const toUpsert = merged
    .filter((p) => overrides[String(p.id)])
    .map(pitchToRow)

  if (toUpsert.length) {
    const { error } = await supabase.from('pitch_templates').upsert(toUpsert, { onConflict: 'id' })
    if (error) {
      console.error('No se pudieron migrar pitches locales a Supabase:', error)
      return merged
    }
  }

  clearLocalOverrides()
  return merged
}

/** Sync load for first paint (defaults). Prefer fetchPitches() for real data. */
export function loadPitches(): Pitch[] {
  return applyLocalOverrides(DEFAULT_PITCHES.map((p) => ({ ...p })))
}

export async function fetchPitches(): Promise<Pitch[]> {
  const { data, error } = await supabase
    .from('pitch_templates')
    .select('id, title, subtitle, placeholder_name, body, categorias, updated_at')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error al cargar pitches desde Supabase:', error)
    return loadPitches()
  }

  if (!data?.length) {
    try {
      const seeded = await seedDefaults()
      return migrateLocalToSupabase(seeded)
    } catch (seedErr) {
      console.error('Error al sembrar pitches en Supabase:', seedErr)
      return loadPitches()
    }
  }

  const fromDb = data.map((row) => rowToPitch(row as PitchRow))
  // Keep any default pitch missing from DB (shouldn't happen)
  const byId = new Map(fromDb.map((p) => [p.id, p]))
  const merged = DEFAULT_PITCHES.map((d) => byId.get(d.id) ?? { ...d })
  return migrateLocalToSupabase(merged)
}

export async function savePitch(pitch: Pitch): Promise<Pitch[]> {
  const row = pitchToRow(pitch)
  const { error } = await supabase.from('pitch_templates').upsert(row, { onConflict: 'id' })

  if (error) {
    console.error('Error al guardar pitch en Supabase:', error)
    // Fallback local so the user doesn't lose the edit
    const overrides = readLocalOverrides()
    overrides[String(pitch.id)] = {
      title: pitch.title,
      subtitle: pitch.subtitle,
      text: pitch.text,
      placeholderName: pitch.placeholderName,
    }
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(overrides))
    } catch {
      // ignore
    }
    throw error
  }

  // Clear local override for this id if any
  const overrides = readLocalOverrides()
  if (overrides[String(pitch.id)]) {
    delete overrides[String(pitch.id)]
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(overrides))
    } catch {
      // ignore
    }
  }

  return fetchPitches()
}

export async function resetPitch(id: number): Promise<Pitch[]> {
  const base = DEFAULT_PITCHES.find((p) => p.id === id)
  if (!base) return fetchPitches()
  return savePitch({ ...base })
}

export function getDefaultPitch(id: number): Pitch | undefined {
  const found = DEFAULT_PITCHES.find((p) => p.id === id)
  return found ? { ...found } : undefined
}
