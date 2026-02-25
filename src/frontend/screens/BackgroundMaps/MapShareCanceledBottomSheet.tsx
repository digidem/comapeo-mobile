import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import ErrorIcon from '../../images/Error.svg';

const m = defineMessages({
  message: {
    id: 'screens.Settings.MapManagement.MapShareCanceled.message',
    defaultMessage: 'Background map sharing canceled without completing.',
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
          <ErrorIcon width={160} height={160} style={styles.icon} />
          <BodyText style={styles.message}>{t(m.message)}</BodyText>
        </View>
        <SecondaryButton
          style={styles.button}
          fullSize
          text={t(m.close)}
          onPress={handleClose}
        />
      </View>
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    alignItems: 'center',
  },
  icon: {
    marginTop: 40,
    marginBottom: 30,
  },
  message: {
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
  },
});
