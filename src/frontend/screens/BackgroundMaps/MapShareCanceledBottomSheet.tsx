import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import ErrorIcon from '../../images/Error.svg';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';

const m = defineMessages({
  title: {
    id: 'screens.Settings.MapManagement.MapShareCanceled.title',
    defaultMessage: 'Sharing Canceled',
  },
  message: {
    id: 'screens.Settings.MapManagement.MapShareCanceled.message',
    defaultMessage: 'Collaborator canceled sharing before completing.',
  },
  close: {
    id: 'screens.Settings.MapManagement.MapShareCanceled.close',
    defaultMessage: 'Close',
  },
});

export function MapShareCanceledBottomSheet({
  navigation,
}: NativeRootNavigationProps<'MapShareCanceledBottomSheet'>) {
  const {formatMessage: t} = useIntl();

  const handleClose = () => {
    navigation.popTo('BackgroundMaps');
  };

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <IconTitleDescription
            icon={<ErrorIcon width={100} height={100} />}
            title={t(m.title)}
            description={t(m.message)}
          />
        </View>
        <SecondaryButton fullSize text={t(m.close)} onPress={handleClose} />
      </View>
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
