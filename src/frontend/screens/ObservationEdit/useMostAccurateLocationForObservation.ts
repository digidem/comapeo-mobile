import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import {
  watchPositionAsync,
  useForegroundPermissions,
  type LocationObject,
  Accuracy,
} from 'expo-location'
import { usePersistedDraftObservation } from '../../hooks/persistedState/usePersistedDraftObservation'
import { useDraftObservation } from '../../hooks/useDraftObservation'
import { useLocationProviderStatus } from '../../hooks/useLocationProviderStatus'

export function useMostAccurateLocationForObservation() {
  const value = usePersistedDraftObservation((store) => store.value)
  const { updateObservationPosition } = useDraftObservation()

  const [permissions] = useForegroundPermissions()

  const providerStatus = useLocationProviderStatus()
  const locationServicesTurnedOff =
    providerStatus && !providerStatus.locationServicesEnabled

  if (locationServicesTurnedOff && !value?.metadata.position) {
    updateObservationPosition({ position: undefined, manualLocation: false })
  }

  useFocusEffect(
    useCallback(() => {
      if (!permissions || !permissions.granted) return

      let ignore = false
      const locationSubscriptionProm = watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
        },
        debounceLocation()((location) => {
          if (ignore) return
          const newCoord = !location
            ? undefined
            : Object.entries(location.coords).map(
                ([key, val]) => [key, val === null ? undefined : val] as const,
              )
          updateObservationPosition({
            position: {
              mocked: false,
              coords: !newCoord ? undefined : Object.fromEntries(newCoord),
              timestamp: location?.timestamp.toString(),
            },
            manualLocation: false,
          })
        }),
      )

      // Should not happen because we are checking permissions above, but just in case
      locationSubscriptionProm.catch((error) => {
        if (ignore) return
        // We should probably set up an error boundary and throw
      })

      return () => {
        ignore = true
        locationSubscriptionProm.then((sub) => sub.remove())
      }
    }, [permissions, updateObservationPosition]),
  )

  return value?.metadata.position
}

function debounceLocation() {
  let lastLocation: LocationObject | undefined

  return function (callback: (location: LocationObject | undefined) => any) {
    return function (location: LocationObject) {
      if (!lastLocation) {
        lastLocation = location
        callback(location)
        return
      }
      const prevAccuracy = lastLocation.coords.accuracy
      const newAccuracy = location.coords.accuracy

      if (!newAccuracy) return

      if (!prevAccuracy || newAccuracy < prevAccuracy) {
        lastLocation = location
        callback(location)
        return
      }
    }
  }
}
