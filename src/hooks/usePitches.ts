import { useCallback, useEffect, useState } from 'react'
import type { Pitch } from '../data/pitches'
import { suggestedPitchId as suggestedFromDefaults } from '../data/pitches'
import { loadPitches, resetPitch, savePitch } from '../lib/pitchesStore'

export function usePitches() {
  const [pitches, setPitches] = useState<Pitch[]>(() => loadPitches())

  useEffect(() => {
    const sync = () => setPitches(loadPitches())
    window.addEventListener('storage', sync)
    window.addEventListener('guaina-pitches-updated', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('guaina-pitches-updated', sync)
    }
  }, [])

  const updatePitch = useCallback((pitch: Pitch) => {
    const next = savePitch(pitch)
    setPitches(next)
    window.dispatchEvent(new Event('guaina-pitches-updated'))
    return next
  }, [])

  const restorePitch = useCallback((id: number) => {
    const next = resetPitch(id)
    setPitches(next)
    window.dispatchEvent(new Event('guaina-pitches-updated'))
    return next
  }, [])

  const suggestedPitchId = useCallback(
    (categoria: string) => suggestedFromDefaults(categoria),
    []
  )

  return { pitches, updatePitch, restorePitch, suggestedPitchId }
}
