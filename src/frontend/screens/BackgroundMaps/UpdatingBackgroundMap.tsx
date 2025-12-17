import * as React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {Bar as ProgressBar} from 'react-native-progress';
import * as Sentry from '@sentry/react-native';

import {useRejectMapShare, useSingleMapShare} from '@comapeo/core-react';
import StackSvg from '../../images/Stack.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
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
  const {mutate: rejectMapShare} = useRejectMapShare();
  const {data: mapShare} = useSingleMapShare({shareId});

  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);

  React.useEffect(() => {
    if (!mapShare) return;

    if (mapShare.state === 'completed') {
      navigation.replace('BackgroundMapUpdated');
    } else if (mapShare.state === 'error') {
      Sentry.captureException(mapShare.error);
      navigation.replace('ErrorBottomSheet');
    }
  }, [mapShare, navigation]);

  const handleCancel = () => {
    rejectMapShare(
      {shareId},
      {
        onSuccess: () => {
          navigation.popTo('BackgroundMaps');
        },
        onError: (err: Error) => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  };

  const downloadProgress = React.useMemo(() => {
    if (!mapShare || mapShare.state !== 'downloading') {
      return 0;
    }
    const progress = mapShare.bytesDownloaded / mapShare.estimatedSizeBytes;
    return Math.min(progress, 1);
  }, [mapShare]);

  const isDownloading = mapShare?.state === 'downloading';

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
            progress={isDownloading ? downloadProgress : undefined}
            indeterminate={!isDownloading}
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
