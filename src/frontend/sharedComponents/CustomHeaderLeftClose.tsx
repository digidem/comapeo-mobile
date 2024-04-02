import React from 'react'
import { HeaderBackButton } from '@react-navigation/elements'
import { HeaderBackButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'
import { Alert, BackHandler } from 'react-native'
import isEqual from 'lodash.isequal'

import { CloseIcon } from './icons'
import { BLACK } from '../lib/styles'
import { useNavigationFromRoot } from '../hooks/useNavigationWithTypes'
import { useDraftObservation } from '../hooks/useDraftObservation'
import { defineMessages, useIntl } from 'react-intl'
import { useObservationWithPreset } from '../hooks/useObservationWithPreset'
import { ClientGeneratedObservation } from '../sharedTypes'
import { Observation } from '@mapeo/schema'
import { usePersistedDraftObservation } from '../hooks/persistedState/usePersistedDraftObservation'
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'

const m = defineMessages({
  discardTitle: {
    id: 'AppContainer.EditHeader.discardTitle',
    defaultMessage: 'Discard observation?',
    description: 'Title of dialog that shows when cancelling a new observation',
  },
  discardConfirm: {
    id: 'AppContainer.EditHeader.discardContent',
    defaultMessage: 'Discard without saving',
    description: 'Button on dialog to cancel a new observation',
  },
  discardChangesTitle: {
    id: 'AppContainer.EditHeader.discardChangesTitle',
    defaultMessage: 'Discard changes?',
    description: 'Title of dialog that shows when cancelling observation edits',
  },
  discardChangesConfirm: {
    id: 'AppContainer.EditHeader.discardChangesContent',
    defaultMessage: 'Discard changes',
    description: 'Button on dialog to cancel observation edits',
  },
  discardCancel: {
    id: 'AppContainer.EditHeader.discardCancel',
    defaultMessage: 'Continue editing',
    description: 'Button on dialog to keep editing (cancelling close action)',
  },
})

// We use a slightly larger back icon, to improve accessibility
// TODO iOS: This should probably be a chevron not an arrow
export const HeaderCloseIcon = ({ tintColor }: { tintColor: string }) => {
  return <CloseIcon color={tintColor} />
}

interface SharedBackButtonProps {
  tintColor?: string
  headerBackButtonProps: HeaderBackButtonProps
  onPress?: () => void
}

type CustomHeaderLeftCloseProps = {
  observationId?: string
} & SharedBackButtonProps

export const CustomHeaderLeftClose = ({
  tintColor,
  headerBackButtonProps,
  observationId,
}: CustomHeaderLeftCloseProps) => {
  if (observationId) {
    return (
      <HeaderBackEditObservation
        tintColor={tintColor}
        headerBackButtonProps={headerBackButtonProps}
        observationId={observationId}
      />
    )
  }

  return (
    <HeaderBackNewObservation
      tintColor={tintColor}
      headerBackButtonProps={headerBackButtonProps}
    />
  )
}

const HeaderBackNewObservation = ({
  tintColor,
  headerBackButtonProps,
}: SharedBackButtonProps) => {
  const navigation = useNavigationFromRoot()
  const { formatMessage: t } = useIntl()
  const { clearDraft } = useDraftObservation()

  const onGoBack = React.useCallback(() => {
    Alert.alert(t(m.discardTitle), undefined, [
      {
        text: t(m.discardConfirm),
        onPress: () => {
          clearDraft()
          navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] }),
          )
        },
      },
      { text: t(m.discardCancel), onPress: () => {} },
    ])
  }, [navigation, clearDraft, t])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        onGoBack()
        return true
      }

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      )

      return () => subscription.remove()
    }, [onGoBack]),
  )

  return (
    <SharedBackButton
      headerBackButtonProps={headerBackButtonProps}
      tintColor={tintColor}
      onPress={onGoBack}
    />
  )
}

type HeaderBackEditObservationProps = {
  observationId: string
} & SharedBackButtonProps

const HeaderBackEditObservation = ({
  headerBackButtonProps,
  tintColor,

  observationId,
}: HeaderBackEditObservationProps) => {
  const navigation = useNavigationFromRoot()
  const { formatMessage: t } = useIntl()

  const { clearDraft } = useDraftObservation()
  const { observation } = useObservationWithPreset(observationId)
  const photos = usePersistedDraftObservation((store) => store.photos)
  const draftObservation = usePersistedDraftObservation((store) => store.value)

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (
        checkEqual(observation, {
          numberOfPhotos: photos.length,
          editted: draftObservation,
        })
      ) {
        return
      }

      e.preventDefault()

      Alert.alert(t(m.discardChangesTitle), undefined, [
        {
          text: t(m.discardChangesConfirm),
          onPress: () => {
            clearDraft()
            navigation.dispatch(e.data.action)
          },
        },
        { text: t(m.discardCancel), onPress: () => {} },
      ])
    })

    return () => unsubscribe()
  }, [observation, photos, draftObservation, navigation, clearDraft])

  return (
    <SharedBackButton
      headerBackButtonProps={headerBackButtonProps}
      tintColor={tintColor}
    />
  )
}

const SharedBackButton = ({
  headerBackButtonProps,
  tintColor,
  onPress,
}: SharedBackButtonProps) => {
  const navigation = useNavigation()
  return (
    <HeaderBackButton
      {...headerBackButtonProps}
      style={{ marginLeft: 0, marginRight: 15 }}
      onPress={onPress ? onPress : () => navigation.goBack()}
      backImage={() => <HeaderCloseIcon tintColor={tintColor || BLACK} />}
    />
  )
}

function checkEqual(
  original: Observation,
  {
    editted,
    numberOfPhotos,
  }: {
    editted: Observation | ClientGeneratedObservation | null
    numberOfPhotos?: number
  },
) {
  if (!editted || !('docId' in editted)) return false
  // attachments are created right before an observation is made, so we need to check # photos that are about to be saved
  const { attachments: originalAtts, ...orignalNoPhotos } = original

  if (originalAtts.length !== numberOfPhotos) return false

  const { attachments, ...edittedNoPhotos } = editted
  return isEqual(orignalNoPhotos, edittedNoPhotos)
}
