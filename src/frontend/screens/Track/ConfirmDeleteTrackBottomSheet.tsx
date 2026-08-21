import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import ErrorIcon from '../../images/Error.svg';
import DiscardIcon from '../../images/delete.svg';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDeleteTrackMutation} from '../../hooks/server/track';
import {DocAlreadyDeletedError, getErrorCode} from '@comapeo/core/errors.js';
import * as Sentry from '@sentry/react-native';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';

const m = defineMessages({
  deleteTitle: {
    id: '$1screens.Track.deleteTitle',
    defaultMessage: 'Delete track?',
  },
  deleteDescription: {
    id: '$1screens.Track.deleteDescription',
    defaultMessage: 'Your Track will be deleted. This cannot be undone.',
  },
  deleteButton: {
    id: '$1screens.Track.deleteButton',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: '$1screens.Track.deleteCancel',
    defaultMessage: 'Cancel',
  },
});

export const ConfirmDeleteTrackBottomSheet = ({
  route,
}: NativeRootNavigationProps<'ConfirmDeleteTrackBottomSheet'>) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const {trackId} = route.params;
  const {mutate: deleteTrackMutation, status} = useDeleteTrackMutation();

  function handleDelete() {
    deleteTrackMutation(
      {docId: trackId},
      {
        onSuccess: () => {
          navigation.pop(2);
        },
        onError: err => {
          // Already deleted (double-tap, or deleted on another device and
          // synced) — the user's intent is satisfied, so finish quietly.
          if (getErrorCode(err) === DocAlreadyDeletedError.code) {
            navigation.pop(2);
            return;
          }
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet', {error: err});
        },
      },
    );
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <IconTitleDescription
          icon={<ErrorIcon width={80} height={80} />}
          title={t(m.deleteTitle)}
          description={t(m.deleteDescription)}
        />
        <View style={styles.buttonsContainer}>
          {status === 'pending' ? (
            <LoadingIndicator style={{marginVertical: 20}} />
          ) : (
            <>
              <DestructiveButton
                fullSize
                text={t(m.deleteButton)}
                renderIcon={() => <DiscardIcon />}
                onPress={handleDelete}
              />
              <SecondaryButton
                fullSize
                text={t(m.cancel)}
                onPress={() => navigation.goBack()}
              />
            </>
          )}
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  buttonsContainer: {
    gap: 16,
    alignItems: 'center',
  },
});
