import {StyleSheet, TouchableOpacity} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';

import {DARK_GREY, WHITE} from '../lib/styles';
import {GpsErrorIcon, GpsGoodIcon, GpsSearchingIcon} from './icons';
import {BodyText} from './Text/BodyText';

type GPSPillProps = {
  accessibilityLabel?: string;
  onPress?: () => void;
  testID?: string;
} & (
  | {
      status: 'searching' | 'error';
    }
  | {
      status: 'good';
      accuracy: number;
    }
);

export const GPSPill = (props: GPSPillProps) => {
  let textValue: string | React.ReactNode;
  let IconToRender: React.FC;

  switch (props.status) {
    case 'error':
      textValue = '--';
      IconToRender = GpsErrorIcon;
      break;
    case 'searching':
      textValue = <UIActivityIndicator size={20} color={WHITE} />;
      IconToRender = GpsSearchingIcon;
      break;
    case 'good': {
      textValue = `± ${Math.abs(Math.round(props.accuracy))} m`;
      IconToRender = GpsGoodIcon;
      break;
    }
    default:
      textValue = <UIActivityIndicator size={20} color={WHITE} />;
      IconToRender = GpsSearchingIcon;
      break;
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={styles.container}
      testID={props.testID}
      accessibilityLabel={props.accessibilityLabel}>
      <IconToRender />

      <BodyText variant="smallMeta" style={styles.text} numberOfLines={1}>
        {textValue}
      </BodyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    minHeight: 32,
    backgroundColor: DARK_GREY,
    borderRadius: 20,
    paddingHorizontal: 10,
    gap: 5,
    flexShrink: 1,
    overflow: 'hidden',
  },
  text: {
    color: WHITE,
    marginBottom: 2,
  },
});
