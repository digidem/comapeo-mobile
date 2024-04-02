import { matchPreset } from '../lib/utils'
import { useObservation } from './server/observations'
import { usePresetsQuery } from './server/presets'

export const useObservationWithPreset = (observationId: string) => {
  const { data: observation } = useObservation(observationId)
  const { data: presets } = usePresetsQuery()
  const preset = matchPreset(observation.tags, presets)

  if (!observation) {
    throw new Error('Observation does not exist')
  }

  if (!preset) {
    throw new Error('Preset does not exist')
  }

  return { observation, preset }
}
