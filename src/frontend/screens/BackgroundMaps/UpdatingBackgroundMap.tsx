import * as React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {Bar as ProgressBar} from 'react-native-progress';
import * as Sentry from '@sentry/react-native';

import {
  useAbortReceivedMapShareDownload,
  useSingleReceivedMapShare,
} from '@comapeo/core-react';
import StackSvg from '../../images/Stack.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {toError} from '../../utils/errors';
import {usePreventAndroidBackButton} from '../../hooks/usePreventAndroidBackButton';
import {
  VERY_LIGHT_GREY,
  NEW_DARK_GREY,
  COMAPEO_BLUE,
  WHITE,
} from '../../lib/styles';

const m = defineMessages({
  updating: {
    id: 'screens.Settings.MapManagement.UpdatingBackgroundMap.updating',
    defaultMessage: 'Updating...',
  },
  cancel: {
    id: 'screens.Settings.MapManagement.UpdatingBackgroundMap.cancel',
    defaultMessage: 'Cancel',
  },
});

export function UpdatingBackgroundMap({
  route,
  navigation,
}: NativeRootNavigationProps<'UpdatingBackgroundMap'>) {
  const {formatMessage: t} = useIntl();
  const {shareId} = route.params;
  const {mutate: abortDownload} = useAbortReceivedMapShareDownload();
  const mapShare = useSingleReceivedMapShare({shareId});

  usePreventAndroidBackButton();

  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);

  React.useEffect(() => {
    if (!mapShare) {
      return;
    }
    if (mapShare.status === 'completed') {
      navigation.replace('BackgroundMapUpdated');
    } else if (mapShare.status === 'error') {
      const error = toError(mapShare.error, 'Map download failed');
      Sentry.captureException(mapShare.error);
      navigation.replace('ErrorBottomSheet', {error});
    } else if (mapShare.status === 'canceled') {
      navigation.popTo('BackgroundMaps');
    }
  }, [mapShare, navigation]);

  const handleCancel = () => {
    abortDownload(
      {shareId},
      {
        onSuccess: () => {
          navigation.popTo('BackgroundMaps');
        },
        onError: (err: unknown) => {
          const error = toError(err, 'Failed to cancel map download');
          Sentry.captureException(error);
          navigation.navigate('ErrorBottomSheet', {error});
        },
      },
    );
  };

  const isDownloading = mapShare?.status === 'downloading';

  const [displayProgress, setDisplayProgress] = React.useState(0);

  React.useEffect(() => {
    if (!isDownloading || !mapShare) {
      setDisplayProgress(0);
      return;
    }

    const interval = setInterval(() => {
      if (mapShare?.status === 'downloading') {
        const progress = Math.min(
          mapShare.bytesDownloaded / mapShare.estimatedSizeBytes,
          1,
        );
        setDisplayProgress(progress);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isDownloading, mapShare]);

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
          <ProgressBar
            {...(isDownloading
              ? {progress: displayProgress, indeterminate: false}
              : {indeterminate: true, indeterminateAnimationDuration: 2000})}
            width={250}
            height={8}
            borderRadius={0}
            color={COMAPEO_BLUE}
            unfilledColor={VERY_LIGHT_GREY}
            borderWidth={0}
            borderColor={WHITE}
          />
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
});
