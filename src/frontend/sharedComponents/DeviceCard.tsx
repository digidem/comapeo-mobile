import { StyleSheet, View } from 'react-native'
import DeviceMobile from '../images/DeviceMobile.svg'
import DeviceDesktop from '../images/DeviceDesktop.svg'
import { Text } from './Text'
import { LIGHT_GREY, MEDIUM_GREY } from '../lib/styles'
import { DeviceType, ViewStyleProp } from '../sharedTypes'
import { defineMessages, useIntl } from 'react-intl'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DeviceNameWithIcon } from './DeviceNameWithIcon'

const m = defineMessages({
  thisDevice: {
    id: 'sharedComponents.DeviceCard.ThisDevice',
    defaultMessage: 'This Device!',
  },
})

type DeviceCardProps = {
  deviceType: DeviceType
  name: string
  thisDevice?: boolean
  deviceId?: string
  dateAdded?: Date
  style?: ViewStyleProp
  onPress?: () => void
}

export const DeviceCard = ({
  deviceType,
  name,
  style,
  thisDevice,
  deviceId,
  dateAdded,
  onPress,
}: DeviceCardProps) => {
  const { formatMessage } = useIntl()

  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={() => (onPress ? onPress() : {})}
      style={[styles.container, style]}
    >
      <DeviceNameWithIcon
        name={name}
        thisDevice={thisDevice}
        deviceType={deviceType}
        deviceId={deviceId}
        iconSize={75}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 3,
  },
})
