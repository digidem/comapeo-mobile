import * as React from 'react'
import { BottomSheetModal, useBottomSheetModal } from './BottomSheetModal'
import { Button } from './Button'
import { StyleSheet, View } from 'react-native'
import { LogoWithErrorIcon } from './LogoWithErrorIcon'
import { Text } from './Text'
import { defineMessages, useIntl } from 'react-intl'

const m = defineMessages({
  somethingWrong: {
    id: 'sharedComponents.ErrorModal.somethingWrong',
    defaultMessage: 'Something Went Wrong',
  },
  goBack: {
    id: 'sharedComponents.ErrorModal.goBack',
    defaultMessage: 'Go Back',
  },
  tryAgain: {
    id: 'sharedComponents.ErrorModal.tryAgain',
    defaultMessage: 'Please go back and try again',
  },
})

type ErrorModalProps = Omit<
  ReturnType<typeof useBottomSheetModal>,
  'openSheet'
> & { clearError?: () => void }

/**
 *
 * should be used with 'useBottomSheetModal()' Hook
 */
export const ErrorModal = ({
  clearError,
  closeSheet,
  sheetRef,
  isOpen,
}: ErrorModalProps) => {
  const { formatMessage } = useIntl()

  function handleGoBack() {
    if (clearError) clearError()
    closeSheet()
  }

  return (
    <BottomSheetModal ref={sheetRef} fullHeight isOpen={isOpen}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <LogoWithErrorIcon />
          <Text style={styles.headerText}>
            {formatMessage(m.somethingWrong)}
          </Text>
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            {formatMessage(m.tryAgain)}
          </Text>
        </View>
        <View style={{ width: '100%' }}>
          <Button fullWidth onPress={handleGoBack}>
            {formatMessage(m.goBack)}
          </Button>
        </View>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    padding: 20,
    paddingTop: 80,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
})
