import {StyleSheet, View} from 'react-native';
import DeviceMobile from '../images/DeviceMobile.svg';
import DeviceDesktop from '../images/DeviceDesktop.svg';
import {Text} from './Text';
import {LIGHT_GREY, MEDIUM_GREY} from '../lib/styles';
import {ViewStyleProp} from '../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  thisDevice: {
    id: 'sharedComponents.DeviceCard.ThisDevice',
    defaultMessage: 'This Device!',
  },
});

type DeviceCardProps = {
  deviceType: 'mobile' | 'desktop'; // to do add "cloud"
  name: string;
  thisDevice?: boolean;
  deviceId?: string;
  dateAdded?: Date;
  style?: ViewStyleProp;
  leaveAction?: () => void;
};

export const DeviceCard = ({
  deviceType,
  name,
  style,
  thisDevice,
  deviceId,
  dateAdded,
  leaveAction,
}: DeviceCardProps) => {
  const {formatMessage} = useIntl();

  return (
    <View style={[styles.container, style]}>
      {deviceType === 'mobile' ? <DeviceMobile /> : <DeviceDesktop />}
      <View style={{justifyContent: 'center', marginLeft: 10}}>
        <Text style={{fontWeight: 'bold'}}>{name}</Text>
        {deviceId && <Text style={{color: MEDIUM_GREY}}>{deviceId}</Text>}
        {thisDevice && (
          <Text style={{color: MEDIUM_GREY}}>
            {formatMessage(m.thisDevice)}
          </Text>
        )}
      </View>
    </View>
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
