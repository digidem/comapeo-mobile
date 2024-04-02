import * as React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { MessageDescriptor, defineMessages, useIntl } from 'react-intl'

import { NativeRootNavigationProps } from '../../../../sharedTypes'
import { useDeviceInfo } from '../../../../hooks/server/deviceInfo'
import { Text } from '../../../../sharedComponents/Text'
import { IconButton } from '../../../../sharedComponents/IconButton'
import { EditIcon } from '../../../../sharedComponents/icons'
import { FieldRow } from './FieldRow'

const m = defineMessages({
  title: {
    id: 'screens.Setting.ProjectSettings.DeviceName.DisplayScreen.title',
    defaultMessage: 'Device Name',
  },
  deviceNameLabel: {
    id: 'screens.Setting.ProjectSettings.DeviceName.DisplayScreen.deviceNameLabel',
    defaultMessage: 'Your Device Name',
  },
})

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string
}) {
  return ({
    navigation,
  }: NativeRootNavigationProps<'DeviceNameDisplay'>): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.title),
      headerRight: () => (
        <IconButton onPress={() => navigation.navigate('DeviceNameEdit')}>
          <EditIcon />
        </IconButton>
      ),
    }
  }
}

export const DisplayScreen = () => {
  const { formatMessage: t } = useIntl()
  const { data } = useDeviceInfo()

  const deviceName = data?.name

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FieldRow label={t(m.deviceNameLabel)}>
        <Text>{deviceName}</Text>
      </FieldRow>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
})
