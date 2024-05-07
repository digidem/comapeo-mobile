import {StyleSheet} from 'react-native';
import {LIGHT_GREY} from '../lib/styles';
import {ViewStyleProp} from '../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {DeviceNameWithIcon} from './DeviceNameWithIcon';
import {DeviceType} from '../sharedTypes/navigation';

const m = defineMessages({
  thisDevice: {
    id: 'sharedComponents.DeviceCard.ThisDevice',
    defaultMessage: 'This Device!',
  },
});

type DeviceCardProps = {
  deviceType: DeviceType;
  name: string;
  thisDevice?: boolean;
  deviceId?: string;
  dateAdded?: Date;
  style?: ViewStyleProp;
  onPress?: () => void;
};

export const DeviceCard = ({
  deviceType,
  name,
  style,
  thisDevice,
  deviceId,
  dateAdded,
  onPress,
}: DeviceCardProps) => {
  const {formatMessage} = useIntl();

  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={() => (onPress ? onPress() : {})}
      style={[styles.container, style]}>
      <DeviceNameWithIcon
        name={name}
        thisDevice={thisDevice}
        deviceType={deviceType}
        deviceId={deviceId}
        iconSize={75}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 3,
  },
});
