import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  BLUE_GREY,
  BLACK,
  LIGHT_GREY,
  DARK_GREY,
  MEDIUM_GREY,
} from '../../lib/styles';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import type {DeviceType} from '../../sharedTypes';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {defineMessages, useIntl} from 'react-intl';
import ShieldIcon from '../../images/BlackShield.svg';

const m = defineMessages({
  thisDevice: {
    id: 'screens.YourTeam.TeamMemberCard.thisDevice',
    defaultMessage: 'This device',
  },
});

type TeamMemberCardProps = {
  deviceType: DeviceType;
  name: string;
  onPress: () => void;
  thisDevice: boolean;
};

export const TeamMemberCard = ({
  deviceType,
  name,
  onPress,
  thisDevice,
}: TeamMemberCardProps) => {
  const {formatMessage} = useIntl();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <DeviceIcon deviceType={deviceType} />
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <HeaderText
            variant="header6"
            style={styles.nameText}
            numberOfLines={2}
            ellipsizeMode="tail">
            {name}
          </HeaderText>
          {thisDevice && (
            <BodyText
              variant="smallMeta"
              style={styles.thisDeviceText}
              numberOfLines={2}
              ellipsizeMode="tail">
              {formatMessage(m.thisDevice)}
            </BodyText>
          )}
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={30} color={BLACK} />
    </TouchableOpacity>
  );
};

const DeviceIcon = ({deviceType}: {deviceType: DeviceType}) => {
  const getIconContent = () => {
    switch (deviceType) {
      case 'mobile':
        return <MaterialIcons name="smartphone" size={15} color={DARK_GREY} />;
      case 'tablet':
        return (
          <MaterialIcons name="tablet-android" size={15} color={DARK_GREY} />
        );
      case 'desktop':
        return <MaterialIcons name="computer" size={15} color={DARK_GREY} />;
      case 'selfHostedServer':
        return <ShieldIcon width={15} height={21} />;
      case 'UNRECOGNIZED':
      case 'device_type_unspecified':
      case undefined:
      default:
        return (
          <MaterialIcons name="help-outline" size={15} color={DARK_GREY} />
        );
    }
  };

  return <View style={styles.iconContainer}>{getIconContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 15,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameText: {
    flexShrink: 1,
    lineHeight: 18,
    includeFontPadding: false,
  },
  thisDeviceText: {
    color: MEDIUM_GREY,
    lineHeight: 18,
    includeFontPadding: false,
  },
});
