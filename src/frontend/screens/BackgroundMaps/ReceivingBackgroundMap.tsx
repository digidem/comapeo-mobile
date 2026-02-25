import * as React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import * as Sentry from '@sentry/react-native';

import {
  useAbortReceivedMapShareDownload,
  useSingleReceivedMapShare,
} from '@comapeo/core-react';
import StackSvg from '../../images/Stack.svg';
import SuccessIcon from '../../images/Success.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {toError} from '../../utils/errors';
import {usePreventAndroidBackButton} from '../../hooks/usePreventAndroidBackButton';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {ReceivingMapProgressBar} from './ReceivingMapProgressBar';
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
});

export function ReceivingBackgroundMap({
  route,
  navigation,
}: NativeRootNavigationProps<'ReceivingBackgroundMap'>) {
  const {formatMessage: t} = useIntl();
  const {shareId} = route.params;
  const {mutate: abortDownload} = useAbortReceivedMapShareDownload();
  const mapShare = useSingleReceivedMapShare({shareId});

  usePreventAndroidBackButton();

  React.useEffect(() => {
    if (mapShare.status === 'error') {
      const error = toError(mapShare.error, 'Map download failed');
      Sentry.captureException(mapShare.error);
      navigation.replace('ErrorBottomSheet', {error});
    } else if (!mapShare || mapShare.status === 'canceled') {
      navigation.goBack();
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

  const handleDone = () => {
    navigation.popTo('BackgroundMaps');
  };

  if (mapShare?.status === 'completed') {
    return <MapUpdated onDone={handleDone} />;
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
