import { PITCHES as DEFAULT_PITCHES, type Pitch } from '../data/pitches'

const STORAGE_KEY = 'guaina-crm-pitches-v1'

type PitchOverride = Partial<Pick<Pitch, 'title' | 'subtitle' | 'text' | 'placeholderName'>>

function readOverrides(): Record<string, PitchOverride> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, PitchOverride>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeOverrides(overrides: Record<string, PitchOverride>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export function loadPitches(): Pitch[] {
  const overrides = readOverrides()
  return DEFAULT_PITCHES.map((pitch) => {
    const o = overrides[String(pitch.id)]
    if (!o) return { ...pitch }
    return {
      ...pitch,
      title: o.title ?? pitch.title,
      subtitle: o.subtitle ?? pitch.subtitle,
      text: o.text ?? pitch.text,
      placeholderName: o.placeholderName ?? pitch.placeholderName,
    }
  })
}

export function savePitch(pitch: Pitch): Pitch[] {
  const base = DEFAULT_PITCHES.find((p) => p.id === pitch.id)
  const overrides = readOverrides()

  if (
    base &&
    pitch.title === base.title &&
    pitch.subtitle === base.subtitle &&
    pitch.text === base.text &&
    pitch.placeholderName === base.placeholderName
  ) {
    delete overrides[String(pitch.id)]
  } else {
    overrides[String(pitch.id)] = {
      title: pitch.title,
      subtitle: pitch.subtitle,
      text: pitch.text,
      placeholderName: pitch.placeholderName,
    }
  }

  writeOverrides(overrides)
  return loadPitches()
}

export function resetPitch(id: number): Pitch[] {
  const overrides = readOverrides()
  delete overrides[String(id)]
  writeOverrides(overrides)
  return loadPitches()
}

export function getDefaultPitch(id: number): Pitch | undefined {
  const found = DEFAULT_PITCHES.find((p) => p.id === id)
  return found ? { ...found } : undefined
}
