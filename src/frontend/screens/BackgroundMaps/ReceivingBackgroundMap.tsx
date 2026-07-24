import * as React from 'react';
import {StyleSheet, View, Pressable, AppState} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import * as Sentry from '@sentry/react-native';
import {useKeepAwake} from 'expo-keep-awake';

import {
  useAbortReceivedMapShareDownload,
  useSingleReceivedMapShare,
  getErrorCode,
  MapShareErrorCode,
} from '@comapeo/core-react';
import {MapShareCanceled} from '../../sharedComponents/MapShareCanceled';
import {MapShareError} from '../../sharedComponents/MapShareError';
import StackSvg from '../../images/Stack.svg';
import SuccessIcon from '../../images/Success.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {toError} from '../../utils/errors';
import {usePreventAndroidBackButton} from '../../hooks/usePreventAndroidBackButton';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {ReceivingMapProgressBar} from './ReceivingMapProgressBar';
import {FullScreenCenteredLoader} from '../../sharedComponents/FullScreenCenteredLoader';
import {VERY_LIGHT_GREY, NEW_DARK_GREY, COMAPEO_BLUE} from '../../lib/styles';

const m = defineMessages({
  updating: {
    id: 'screens.Settings.MapManagement.UpdatingBackgroundMap.updating',
    defaultMessage: 'Updating...',
  },
  cancel: {
    id: 'screens.Settings.MapManagement.UpdatingBackgroundMap.cancel',
    defaultMessage: 'Cancel',
  },
  mapUpdated: {
    id: 'screens.Settings.MapManagement.BackgroundMapUpdated.mapUpdated',
    defaultMessage: 'Background map updated.',
  },
  done: {
    id: 'screens.Settings.MapManagement.BackgroundMapUpdated.done',
    defaultMessage: 'Done',
  },
  downloadErrorTitle: {
    id: 'screens.Settings.MapManagement.ReceivingBackgroundMap.downloadErrorTitle',
    defaultMessage: 'Connection Lost',
  },
  downloadErrorDescription: {
    id: 'screens.Settings.MapManagement.ReceivingBackgroundMap.downloadErrorDescription',
    defaultMessage:
      'Map sharing was interrupted. Make sure both devices are connected to the same network and try again.',
  },
  downloadFailedTitle: {
    id: 'screens.Settings.MapManagement.ReceivingBackgroundMap.downloadFailedTitle',
    defaultMessage: 'Map Download Failed',
  },
});

export function ReceivingBackgroundMap({
  route,
  navigation,
}: NativeRootNavigationProps<'ReceivingBackgroundMap'>) {
  const {formatMessage: t} = useIntl();
  const {shareId} = route.params;
  const {mutate: abortDownload, status: abortStatus} =
    useAbortReceivedMapShareDownload();
  const mapShare = useSingleReceivedMapShare({shareId});

  usePreventAndroidBackButton();
  useKeepAwake();

  const handleCancel = React.useCallback(() => {
    abortDownload(
      {shareId},
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: (err: unknown) => {
          const code = getErrorCode(err);
          if (
            code === MapShareErrorCode.MAP_SHARE_CANCELED ||
            code === MapShareErrorCode.INVALID_STATUS_TRANSITION ||
            code === MapShareErrorCode.MAP_SHARE_NOT_FOUND
          ) {
            navigation.goBack();
            return;
          }
          const error = toError(err, 'Failed to cancel map download');
          Sentry.captureException(error);
          navigation.replace('BackgroundMapErrorBottomSheet', {
            title: error.message,
            description: error.message,
          });
        },
      },
    );
  }, [abortDownload, shareId, navigation]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'background') {
        handleCancel();
      }
    });
    return () => subscription.remove();
  }, [handleCancel]);

  const handleDone = () => {
    navigation.goBack();
  };

  if (abortStatus === 'pending') {
    return <FullScreenCenteredLoader />;
  }

  if (mapShare.status === 'canceled') {
    return <MapShareCanceled onClose={handleDone} />;
  }

  if (mapShare.status === 'error') {
    const isDownloadError =
      mapShare.error.code === MapShareErrorCode.DOWNLOAD_ERROR;
    const title = isDownloadError
      ? t(m.downloadErrorTitle)
      : t(m.downloadFailedTitle);
    const description = isDownloadError
      ? t(m.downloadErrorDescription)
      : mapShare.error.message;
    Sentry.captureException(
      new Error(
        `Map download error [${mapShare.error.code}]: ${mapShare.error.message}`,
      ),
    );
    return (
      <MapShareError
        title={title}
        description={description}
        onClose={handleDone}
      />
    );
  }

  if (mapShare.status === 'completed') {
    return <MapUpdated onDone={() => navigation.replace('BackgroundMaps')} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.iconBackground}>
          <StackSvg width={47} height={50} color={NEW_DARK_GREY} />
        </View>

        <HeaderText variant="header2">{t(m.updating)}</HeaderText>

        <View style={styles.progressContainer}>
          <MaterialIcon
            name="sync"
            size={24}
            color={COMAPEO_BLUE}
            style={styles.syncIcon}
          />
          <ReceivingMapProgressBar shareId={shareId} />
        </View>
      </View>

      <Pressable onPress={handleCancel} style={styles.cancelButton}>
        <HeaderText variant="header4" style={styles.cancelText}>
          {t(m.cancel)}
        </HeaderText>
      </Pressable>
    </View>
  );
}

function MapUpdated({onDone}: {onDone: () => void}) {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.successContainer}>
      <View style={styles.successContent}>
        <IconTitleDescription icon={<SuccessIcon />} title={t(m.mapUpdated)} />
      </View>
      <View style={styles.buttonContainer}>
        <SecondaryButton fullSize text={t(m.done)} onPress={onDone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
    gap: 20,
    marginTop: 120,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: VERY_LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    gap: 15,
  },
  syncIcon: {
    alignSelf: 'flex-start',
  },
  cancelButton: {
    marginTop: 80,
  },
  cancelText: {
    color: COMAPEO_BLUE,
  },
  successContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
