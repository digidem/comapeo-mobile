import * as React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { StyleSheet } from 'react-native'
import { RED } from '../../lib/styles'
import {
  BottomSheetContent,
  BottomSheetModal,
} from '../../sharedComponents/BottomSheetModal'
import { ErrorIcon } from '../../sharedComponents/icons'
import { NativeRootNavigationProps } from '../../sharedTypes'
import { usePersistedPasscode } from '../../hooks/persistedState/usePersistedPasscode'
import { useNavigationFromRoot } from '../../hooks/useNavigationWithTypes'
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'

const m = defineMessages({
  title: {
    id: 'screens.AppPasscode.ConfirmPasscodeSheet.title',
    defaultMessage:
      'App Passcodes can never be recovered if lost or forgotten! Make sure to note your passcode in a secure location before saving.',
  },
  cancel: {
    id: 'screens.AppPasscode.ConfirmPasscodeSheet.cancel',
    defaultMessage: 'Cancel',
  },
  saveAppPasscode: {
    id: 'screens.AppPasscode.ConfirmPasscodeSheet.saveAppPasscode',
    defaultMessage: 'Save App Passcode',
  },
  passcode: {
    id: 'screens.AppPasscode.ConfirmPasscodeSheet.passcode',
    defaultMessage: 'Passcode',
    description: 'used to indicate to the user what the new passcode will be.',
  },
})

type ConfirmPasscodeSheetProps = {
  inputtedPasscode: string
  isOpen: boolean
}

export const ConfirmPasscodeSheet = React.forwardRef<
  BottomSheetModalMethods,
  ConfirmPasscodeSheetProps
>(({ inputtedPasscode, isOpen }, sheetRef) => {
  const { formatMessage: t } = useIntl()
  const setPasscode = usePersistedPasscode((store) => store.setPasscode)
  const navigation = useNavigationFromRoot()

  function setPasscodeAndNavigateBack() {
    setPasscode(inputtedPasscode)
    navigation.navigate('Security')
  }

  return (
    <BottomSheetModal isOpen={isOpen} ref={sheetRef} onDismiss={() => {}}>
      <BottomSheetContent
        titleStyle={styles.text}
        descriptionStyle={styles.text}
        title={t(m.title)}
        description={`${t(m.passcode)}: ${inputtedPasscode}`}
        buttonConfigs={[
          {
            text: t(m.cancel),
            onPress: () => {
              navigation.navigate('Security')
            },
            variation: 'outlined',
          },
          {
            text: t(m.saveAppPasscode),
            variation: 'filled',
            onPress: setPasscodeAndNavigateBack,
          },
        ]}
        icon={
          <ErrorIcon style={{ position: 'relative' }} size={90} color={RED} />
        }
      />
    </BottomSheetModal>
  )
})

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
})
