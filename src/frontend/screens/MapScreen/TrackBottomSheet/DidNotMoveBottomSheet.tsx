import {BottomSheetWrapper} from '../../../sharedComponents/BottomSheetWrapper';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {
  SecondaryButton,
  DestructiveButton,
} from '../../../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {useTracking} from '../../../hooks/useTracking';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import ErrorIcon from '../../../images/Error.svg';
import {StyleSheet, View} from 'react-native';

const m = defineMessages({
  noTrackRecorded: {
    id: 'TrackBottomSheet.DidNotMove.noTrackRecorded',
    defaultMessage: 'No Track Recorded',
  },
  didNotMove: {
    id: 'TrackBottomSheet.DidNotMove.didNotMove',
    defaultMessage: "You didn't move beyond one meter.",
  },
  delete: {
    id: 'TrackBottomSheet.DidNotMove.delete',
    defaultMessage: 'Exit Tracks',
  },
  keepRecording: {
    id: 'TrackBottomSheet.DidNotMove.keepRecording',
    defaultMessage: 'Continue Recording',
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
        <ErrorIcon width="60" height={60} />

        <HeaderText variant="header2" style={styles.headerText}>
          {formatMessage(m.noTrackRecorded)}
        </HeaderText>

        <BodyText style={styles.bodyText}>
          {formatMessage(m.didNotMove)}
        </BodyText>

        <View style={styles.buttonContainer}>
          <DestructiveButton
            fullSize
            text={formatMessage(m.delete)}
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
  headerText: {
    textAlign: 'center',
  },
  bodyText: {
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    paddingTop: 10,
    gap: 10,
  },
});
