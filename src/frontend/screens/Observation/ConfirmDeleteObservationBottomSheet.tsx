import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import ErrorIcon from '../../images/Error.svg';
import DiscardIcon from '../../images/delete.svg';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDeleteDocument} from '@comapeo/core-react';
import * as Sentry from '@sentry/react-native';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  deleteTitle: {
    id: '$1screens.Observation.deleteTitle',
    defaultMessage: 'Delete observation?',
  },
  deleteDescription: {
    id: '$1screens.Observation.deleteDescription',
    defaultMessage: 'Your Observation will be deleted. This cannot be undone.',
  },
  deleteButton: {
    id: '$1screens.Observation.deleteButton',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: '$1screens.Observation.deleteCancel',
    defaultMessage: 'Cancel',
  },
});

export const ConfirmDeleteObservationBottomSheet = ({
  route,
}: NativeRootNavigationProps<'ConfirmDeleteObservationBottomSheet'>) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const {projectId} = useActiveProject();
  const {observationId} = route.params;
  const {mutate: deleteObservationMutation, error: deleteObservationError} =
    useDeleteDocument({
      docType: 'observation',
      projectId,
    });

  function handleDelete() {
    deleteObservationMutation(
      {docId: observationId},
      {
        onSuccess: () => {
          navigation.pop(2);
        },
        onError: () => {
          Sentry.captureException(deleteObservationError);
        },
      },
    );
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.icon}>
          <ErrorIcon width={80} height={80} />
        </View>

        <HeaderText variant="header2" style={styles.title}>
          {t(m.deleteTitle)}
        </HeaderText>

        <BodyText variant="large" style={styles.description}>
          {t(m.deleteDescription)}
        </BodyText>

        <View style={styles.buttonsContainer}>
          <DestructiveButton
            fullSize
            testID="OBS.confirm-delete-btn"
            text={t(m.deleteButton)}
            renderIcon={() => <DiscardIcon />}
            onPress={handleDelete}
          />
          <SecondaryButton
            fullSize
            text={t(m.cancel)}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  icon: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 16,
    alignItems: 'center',
  },
});
