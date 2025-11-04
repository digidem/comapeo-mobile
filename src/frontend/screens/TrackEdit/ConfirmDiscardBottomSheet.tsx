import {defineMessages, useIntl} from 'react-intl';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import ErrorIcon from '../../images/Error.svg';
import DiscardIcon from '../../images/delete.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  discardTitle: {
    id: 'TrackEdit.HeaderLeft.discardTitle',
    defaultMessage: 'Discard changes?',
    description: 'Title of dialog that shows when cancelling track edits',
  },
  discardTrackDescription: {
    id: 'TrackEdit.HeaderLeft.discardTrackDescription',
    defaultMessage: 'Your changes will not be saved. This cannot be undone.',
  },
  discardCancel: {
    id: 'TrackEdit.HeaderLeft.discardCancel',
    defaultMessage: 'Continue editing',
    description: 'Button on dialog to keep editing (cancelling close action)',
  },
  discardTrackButton: {
    id: 'TrackEdit.HeaderLeft.discardTrackButton',
    defaultMessage: 'Discard changes',
    description: 'Button to confirm discarding the track',
  },
});

export const ConfirmDiscardBottomSheet = ({
  navigation,
  route,
}: NativeRootNavigationProps<'ConfirmTrackDiscardBottomSheet'>) => {
  const {formatMessage} = useIntl();
  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <ErrorIcon />
        <HeaderText variant="header2">
          {formatMessage(m.discardTitle)}
        </HeaderText>

        <BodyText style={{textAlign: 'center'}}>
          {formatMessage(m.discardTrackDescription)}
        </BodyText>

        <DestructiveButton
          fullSize
          onPress={() => {
            navigation.popTo('Track', {trackId: route.params.trackId});
          }}
          renderIcon={({size, color}) => {
            return <DiscardIcon width={size} height={size} fill={color} />;
          }}
          text={formatMessage(m.discardTrackButton)}
        />
        <SecondaryButton
          fullSize
          onPress={() => {
            navigation.goBack();
          }}
          text={formatMessage(m.discardCancel)}
        />
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
});
