import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import DeviceMobile from '../images/DeviceMobile.svg'
import DeviceDesktop from '../images/DeviceDesktop.svg'
import { DeviceType, ViewStyleProp } from '../sharedTypes'
import { defineMessages, useIntl } from 'react-intl'
import { Text } from './Text'
import { MEDIUM_GREY } from '../lib/styles'

const m = defineMessages({
  thisDevice: {
    id: 'sharedComponents.DeviceIconWithName.thisDevice',
    defaultMessage: 'This Device!',
  },
})

type DeviceNameWithIconProps = {
  deviceType: DeviceType
  name: string
  deviceId?: string
  thisDevice?: boolean
  iconSize?: number
  style?: ViewStyleProp
}

export const DeviceNameWithIcon = ({
  deviceType,
  name,
  deviceId,
  thisDevice,
  iconSize,
  style,
}: DeviceNameWithIconProps) => {
  const { formatMessage } = useIntl()
  return (
    <View style={[styles.flexRow, style]}>
      {deviceType === 'mobile' ? (
        <DeviceMobile width={iconSize || 35} height={iconSize || 35} />
      ) : (
        <DeviceDesktop width={iconSize || 35} height={iconSize || 35} />
      )}
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>{name}</Text>
        {deviceId && (
          <Text style={{ color: MEDIUM_GREY }} numberOfLines={1}>
            {`${deviceId.slice(0, 12)}...`}
          </Text>
        )}
        {thisDevice && (
          <Text style={{ flex: 1, color: MEDIUM_GREY }}>
            {formatMessage(m.thisDevice)}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
