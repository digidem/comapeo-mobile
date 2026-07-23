import {type ReactNode} from 'react';
import {TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcon from '@react-native-vector-icons/material-design-icons';
import {LoadingIndicator} from '../LoadingIndicator';
import {type UnitSystem} from '../../contexts/UnitSystemStoreContext';

import {ExhaustivenessError} from '../../lib/ExhaustivenessError';
import {
  DARK_GREY,
  DARK_MAGENTA,
  GREEN,
  WARNING_RED,
  WHITE,
} from '../../lib/styles';
import {BodyText} from '../Text/BodyText';

type Props = {
  accessibilityLabel?: string;
  onPress?: () => void;
  iconTestID?: string;
  testID?: string;
  unitSystem: UnitSystem;
} & (
  | {
      status: 'searching' | 'error';
    }
  | {
      status: 'good';
      accuracy: number;
    }
);

export const GPSPillUI = (props: Props) => {
  let backgroundColor: string;
  let icon: ReactNode;
  let text: string;

  switch (props.status) {
    case 'error': {
      backgroundColor = WARNING_RED;
      text = '--';
      icon = (
        <View
          testID={props.iconTestID}
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
      backgroundColor = DARK_GREY;
      text = '--';
      icon = (
        <View testID={props.iconTestID}>
          <LoadingIndicator
            hidesWhenStopped={false}
            size="small"
            color={WHITE}
          />
        </View>
      );

      break;
    }

    case 'good': {
      backgroundColor = DARK_GREY;
      const unit = props.unitSystem === 'imperial' ? 'ft' : 'm';
      const accuracyValue =
        props.unitSystem === 'imperial'
          ? Math.abs(Math.round(props.accuracy * 3.28084))
          : Math.abs(Math.round(props.accuracy));
      text = `±${accuracyValue} ${unit}`;
      icon = (
        <View
          testID={props.iconTestID}
          style={{
            backgroundColor: GREEN,
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
        backgroundColor,
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
