import { useCallback, useEffect, useState } from 'react'
import type { Pitch } from '../data/pitches'
import { suggestedPitchId as suggestedFromDefaults } from '../data/pitches'
import { fetchPitches, loadPitches, resetPitch, savePitch } from '../lib/pitchesStore'

export function usePitches() {
  const [pitches, setPitches] = useState<Pitch[]>(() => loadPitches())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const next = await fetchPitches()
      setPitches(next)
    } catch (e) {
      console.error(e)
      setError('No se pudieron cargar los pitches')
      setPitches(loadPitches())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const sync = () => {
      void refresh()
    }
    window.addEventListener('guaina-pitches-updated', sync)
    return () => window.removeEventListener('guaina-pitches-updated', sync)
  }, [refresh])

  const updatePitch = useCallback(async (pitch: Pitch) => {
    const next = await savePitch(pitch)
    setPitches(next)
    window.dispatchEvent(new Event('guaina-pitches-updated'))
    return next
  }, [])

  const restorePitch = useCallback(async (id: number) => {
    const next = await resetPitch(id)
    setPitches(next)
    window.dispatchEvent(new Event('guaina-pitches-updated'))
    return next
  }, [])

  const suggestedPitchId = useCallback(
    (categoria: string) => suggestedFromDefaults(categoria),
    []
  )

  return { pitches, loading, error, refresh, updatePitch, restorePitch, suggestedPitchId }
}
