import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {defineMessages, useIntl} from 'react-intl';
import * as Sentry from '@sentry/react-native';

import GraphIcon from '../../images/Graph.svg';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {DARK_ORANGE, NEW_DARK_GREY} from '../../lib/styles';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {FullScreenCenteredLoader} from '../../sharedComponents/FullScreenCenteredLoader';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useUpdateProjectSettings} from '@comapeo/core-react';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {usePreventAndroidBackButton} from '../../hooks/usePreventAndroidBackButton';
import {toError} from '../../utils/errors';

const m = defineMessages({
  shareProjectStats: {
    id: '$1screens.ShareProjectStats.shareProjectStats',
    defaultMessage: 'Share Project Statistics',
  },
  description: {
    id: 'screens.ShareProjectStats.description',
    defaultMessage:
      'This will help us gather data about how CoMapeo is being used and what additional features are needed.',
  },
  infoAnonymized: {
    id: 'screens.ShareProjectStats.infoAnonymized',
    defaultMessage: 'Shared information will be completely anonymized',
  },
  fullyEncrypted: {
    id: 'screens.ShareProjectStats.fullyEncrypted',
    defaultMessage: 'Your project will stay fully encrypted',
  },
  skip: {
    id: '$1screens.ShareProjectStats.skip',
    defaultMessage: 'No, Skip for Now',
  },
  yesShare: {
    id: '$1screens.ShareProjectStats.yesShare',
    defaultMessage: 'Yes, Share Stats',
  },
});

export const ShareProjectStats = ({
  route,
  navigation,
}: NativeRootNavigationProps<'ShareProjectStats'>) => {
  const {formatMessage} = useIntl();
  const {projectName} = route.params;

  const {projectId} = useActiveProject();
  const updateSettings = useUpdateProjectSettings({projectId});

  usePreventAndroidBackButton();

  const goToSuccess = React.useCallback(
    (statsShared: boolean) => {
      navigation.replace('ProjectCreated', {
        name: projectName,
        statsShared,
      });
    },
    [navigation, projectName],
  );

  function handleSkip() {
    goToSuccess(false);
  }

  function handleShare() {
    try {
      updateSettings.mutate(
        {sendStats: true},
        {
          onSuccess: () => goToSuccess(true),
          onError: err => {
            Sentry.captureException(err);
            navigation.navigate('ErrorBottomSheet', {error: err});
          },
        },
      );
    } catch (err) {
      Sentry.captureException(err);
      navigation.navigate('ErrorBottomSheet', {
        error: toError(err, 'Error updating sharing settings'),
      });
    }
  }
  const isSubmitting = updateSettings.status === 'pending';

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.content}
      dockContainerStyle={styles.dock}
      dockContent={
        isSubmitting ? (
          <View style={styles.loading}>
            <FullScreenCenteredLoader />
          </View>
        ) : (
          <View style={styles.buttons}>
            <SecondaryButton
              fullSize
              onPress={handleSkip}
              text={formatMessage(m.skip)}
            />
            <PrimaryButton
              fullSize
              onPress={handleShare}
              text={formatMessage(m.yesShare)}
            />
          </View>
        )
      }>
      <View style={styles.headerBlock}>
        <GraphIcon color={DARK_ORANGE} />
        <HeaderText variant="header1" style={styles.headerTitle}>
          {formatMessage(m.shareProjectStats)}
        </HeaderText>
      </View>

      <View style={styles.infoBox}>
        <BodyText>{formatMessage(m.description)}</BodyText>

        <View style={styles.bulletRow}>
          <MaterialIcons
            name="circle"
            size={4}
            color={NEW_DARK_GREY}
            style={styles.bulletDot}
          />
          <BodyText variant="smallMeta" style={styles.bulletText}>
            {formatMessage(m.infoAnonymized)}
          </BodyText>
        </View>

        <View style={styles.bulletRow}>
          <MaterialIcons
            name="circle"
            size={4}
            color={NEW_DARK_GREY}
            style={styles.bulletDot}
          />
          <BodyText variant="smallMeta" style={styles.bulletText}>
            {formatMessage(m.fullyEncrypted)}
          </BodyText>
        </View>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 30,
  },
  headerBlock: {
    alignItems: 'center',
    gap: 20,
  },
  headerTitle: {
    textAlign: 'center',
  },
  infoBox: {
    width: '100%',
    padding: 20,
    gap: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
  },
  bulletDot: {
    marginTop: 2,
  },
  bulletText: {
    color: NEW_DARK_GREY,
    flex: 1,
  },
  dock: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  buttons: {
    gap: 10,
  },
  loading: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
  },
});
