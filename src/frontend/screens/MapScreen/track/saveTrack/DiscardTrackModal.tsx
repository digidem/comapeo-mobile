import React, {FC} from 'react';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import ErrorIcon from '../../../../images/Error.svg';
import {useNavigationFromHomeTabs} from '../../../../hooks/useNavigationWithTypes';
import {useCurrentTrackStore} from '../../../../hooks/tracks/useCurrentTrackStore';
import {TabName} from '../../../../Navigation/types';
import DiscardIcon from '../../../../images/delete.svg';
import {
  BottomSheetContent,
  BottomSheetModal,
} from '../../../../sharedComponents/BottomSheetModal';

export interface DiscardTrackModal {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  isOpen: boolean;
}

const m = defineMessages({
  discardTrackTitle: {
    id: 'Modal.DiscardTrack.title',
    defaultMessage: 'Discard Track?',
  },
  discardTrackDescription: {
    id: 'Modal.DiscardTrack.description',
    defaultMessage: 'Your Track will not be saved.\n This cannot be undone.',
  },
  discardTrackDiscardButton: {
    id: 'Modal.GPSDisable.discardButton',
    defaultMessage: 'Discard Track',
  },
  discardTrackDefaultButton: {
    id: 'Modal.GPSDisable.defaultButton',
    defaultMessage: 'Continue Editing',
  },
});

export const DiscardTrackModal: FC<DiscardTrackModal> = ({
  bottomSheetRef,
  isOpen,
}) => {
  const {formatMessage} = useIntl();
  const navigation = useNavigationFromHomeTabs();
  const clearCurrentTrack = useCurrentTrackStore(
    state => state.clearCurrentTrack,
  );
  const handleDiscard = () => {
    bottomSheetRef.current?.close();
    navigation.navigate(TabName.Map);
    clearCurrentTrack();
  };

  const handleContinue = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheetModal ref={bottomSheetRef} isOpen={isOpen}>
      <BottomSheetContent
        loading={false}
        buttonConfigs={[
          {
            variation: 'filled',
            dangerous: true,
            onPress: handleDiscard,
            text: formatMessage(m.discardTrackDiscardButton),
            icon: <DiscardIcon />,
          },
          {
            onPress: handleContinue,
            text: formatMessage(m.discardTrackDefaultButton),
            variation: 'outlined',
          },
        ]}
        title={formatMessage(m.discardTrackTitle)}
        description={formatMessage(m.discardTrackDescription)}
        icon={<ErrorIcon width={60} height={60} style={styles.image} />}
      />
    </BottomSheetModal>
  );
};

export const styles = StyleSheet.create({
  image: {marginBottom: 15},
});
