import * as React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {Bar as ProgressBar} from 'react-native-progress';
import * as Sentry from '@sentry/react-native';

import {
  useCancelSentMapShare,
  useGetCustomMapInfo,
  useSingleSentMapShare,
} from '@comapeo/core-react';
import StackSvg from '../../images/Stack.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {toError} from '../../utils/errors';
import {
  VERY_LIGHT_GREY,
  NEW_DARK_GREY,
  COMAPEO_BLUE,
  WHITE,
} from '../../lib/styles';

const m = defineMessages({
  sending: {
    id: 'screens.Settings.MapManagement.SendingMap.sending',
    defaultMessage: 'Sending...',
  },
  cancel: {
    id: 'screens.Settings.MapManagement.SendingMap.cancel',
    defaultMessage: 'Cancel',
  },
});

export function SendingMap({
  route,
  navigation,
}: NativeRootNavigationProps<'SendingMap'>) {
  const {formatMessage: t} = useIntl();
  const {shareId} = route.params;
  const mapShare = useSingleSentMapShare({shareId});
  const {mutate: cancelMapShare} = useCancelSentMapShare();
  const {data: mapInfoData} = useGetCustomMapInfo();
  const mapInfo = mapInfoData as
    | {estimatedSizeBytes: number}
    | null
    | undefined;

  React.useEffect(() => {
    if (!mapShare) return;
    if (mapShare.status === 'completed') {
      navigation.replace('MapSent');
    } else if (mapShare.status === 'canceled') {
      navigation.popTo('BackgroundMaps');
    } else if (mapShare.status === 'error') {
      const err = new Error('Map share failed');
      Sentry.captureException(err);
      navigation.replace('ErrorBottomSheet', {error: err});
    }
  }, [mapShare, navigation]);

  const handleCancel = () => {
    cancelMapShare(
      {shareId},
      {
        onSuccess: () => {
          navigation.popTo('BackgroundMaps');
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet', {
            error: toError(err, 'Failed to cancel map share'),
          });
        },
      },
    );
  };

  const downloadProgress = React.useMemo(() => {
    if (
      !mapShare ||
      mapShare.status !== 'downloading' ||
      !mapInfo?.estimatedSizeBytes
    ) {
      return 0;
    }
    return Math.min(mapShare.bytesDownloaded / mapInfo.estimatedSizeBytes, 1);
  }, [mapShare, mapInfo]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.iconBackground}>
          <StackSvg width={47} height={50} color={NEW_DARK_GREY} />
        </View>

        <HeaderText variant="header2">{t(m.sending)}</HeaderText>

        <View style={styles.progressContainer}>
          <MaterialIcon
            name="sync"
            size={24}
            color={COMAPEO_BLUE}
            style={styles.syncIcon}
          />
          <ProgressBar
            progress={downloadProgress > 0 ? downloadProgress : undefined}
            indeterminate={downloadProgress === 0}
            indeterminateAnimationDuration={2000}
            width={250}
            height={8}
            borderRadius={0}
            color={COMAPEO_BLUE}
            unfilledColor={VERY_LIGHT_GREY}
            borderWidth={0}
            animationType="spring"
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
