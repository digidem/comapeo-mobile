import {BottomSheetWrapper} from '../../../sharedComponents/BottomSheetWrapper';
import {defineMessages, useIntl} from 'react-intl';
import {
  SecondaryButton,
  DestructiveButton,
} from '../../../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {useTracking} from '../../../hooks/useTracking';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import ErrorIcon from '../../../images/Error.svg';
import {StyleSheet, View} from 'react-native';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';

const m = defineMessages({
  noTrackRecorded: {
    id: '$1TrackBottomSheet.DidNotMove.noTrackRecorded',
    defaultMessage: 'No Track Recorded',
  },
  didNotMove: {
    id: 'TrackBottomSheet.DidNotMove.didNotMove',
    defaultMessage: "This device didn't move.",
  },
  discard: {
    id: 'TrackBottomSheet.DidNotMove.discard',
    defaultMessage: 'Discard',
  },
  keepRecording: {
    id: 'TrackBottomSheet.DidNotMove.keepRecording',
    defaultMessage: 'Keep Recording',
  },
});

export const DidNotMoveBottomSheet = ({
  navigation,
}: NativeRootNavigationProps<'DidNotMoveBottomSheet'>) => {
  const {formatMessage} = useIntl();
  const {cancelTracking} = useTracking();
  const clearAndDismiss = () => {
    cancelTracking();
    navigation.goBack();
  };

  return (
    <BottomSheetWrapper>
      <View style={styles.content}>
        <IconTitleDescription
          icon={<ErrorIcon width="60" height={60} />}
          title={formatMessage(m.noTrackRecorded)}
          description={formatMessage(m.didNotMove)}
        />

        <View style={styles.buttonContainer}>
          <DestructiveButton
            fullSize
            text={formatMessage(m.discard)}
            onPress={clearAndDismiss}
            renderIcon={({color, size}) => (
              <MaterialIcons name="delete" size={size} color={color} />
            )}
          />

          <SecondaryButton
            fullSize
            text={formatMessage(m.keepRecording)}
            onPress={() => {
              navigation.popTo('Home', {
                screen: 'Map',
                params: {trackingOpen: true},
              });
            }}
            renderIcon={({color, size}) => (
              <MaterialIcons name="directions-walk" size={size} color={color} />
            )}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 20,
    gap: 10,
  },
  buttonContainer: {
    paddingTop: 10,
    gap: 10,
  },
});
