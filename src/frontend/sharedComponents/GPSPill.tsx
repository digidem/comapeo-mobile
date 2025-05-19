import {type ReactNode} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {ExhaustivenessError} from '../lib/ExhaustivenessError';
import {DARK_MAGENTA, MAGENTA, WHITE} from '../lib/styles';
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
  let backgroundColor: string;
  let icon: ReactNode;
  let text: string;

  switch (props.status) {
    case 'error': {
      backgroundColor = MAGENTA;
      text = '--';
      icon = (
        <View
          role="none"
          style={{
            backgroundColor: DARK_MAGENTA,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            width: 14,
            height: 14,
          }}>
          <MaterialCommunityIcon name="exclamation" color={WHITE} size={12} />
        </View>
      );

      break;
    }

    case 'searching': {
      const isE2E = process.env.EXPO_PUBLIC_E2E_TEST === 'true';

      backgroundColor = '#333333';
      text = '--';
      icon = (
        <View role="none">
          <UIActivityIndicator
            animating={!isE2E}
            hidesWhenStopped={false}
            size={12}
            color={WHITE}
            style={{flex: 0}}
          />
        </View>
      );

      break;
    }

    case 'good': {
      backgroundColor = '#333333';
      text = `${Math.abs(Math.round(props.accuracy))} ±`;
      icon = (
        <View
          role="none"
          style={{
            backgroundColor: '#36F927',
            height: 12,
            width: 12,
            borderRadius: 50,
          }}
        />
      );

      break;
    }

    default:
      // @ts-expect-error Exhaustive
      throw new ExhaustivenessError(props.status);
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      testID={props.testID}
      accessibilityLabel={props.accessibilityLabel}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: backgroundColor,
      }}>
      {icon}
      <BodyText
        variant="smallMeta"
        numberOfLines={1}
        style={{
          color: WHITE,
          paddingBottom: 2,
          minWidth: 30,
          textAlign: 'center',
        }}>
        {text}
      </BodyText>
    </TouchableOpacity>
  );
};
