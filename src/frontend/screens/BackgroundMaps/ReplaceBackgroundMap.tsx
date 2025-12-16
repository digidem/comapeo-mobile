import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import StackSvg from '../../images/Stack.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {VERY_LIGHT_GREY, RED, NEW_DARK_GREY} from '../../lib/styles';
import {useRejectMapShare} from '@comapeo/core-react';
import * as Sentry from '@sentry/react-native';

const m = defineMessages({
  replaceMapTitle: {
    id: 'screens.Settings.MapManagement.ReplaceBackgroundMap.replaceMapTitle',
    defaultMessage: 'Replace current background map?',
  },
  replaceMapDescription: {
    id: 'screens.Settings.MapManagement.ReplaceBackgroundMap.replaceMapDescription',
    defaultMessage:
      'This device has a background map that will be replaced if you continue.',
  },
  yesReplace: {
    id: 'screens.Settings.MapManagement.ReplaceBackgroundMap.yesReplace',
    defaultMessage: 'Yes, Replace',
  },
  cancel: {
    id: 'screens.Settings.MapManagement.ReplaceBackgroundMap.cancel',
    defaultMessage: 'Cancel',
  },
});

export function ReplaceBackgroundMap({
  route,
  navigation,
}: NativeRootNavigationProps<'ReplaceBackgroundMap'>) {
  const {formatMessage: t} = useIntl();
  const {shareId} = route.params;
  const {mutate: rejectMapShare} = useRejectMapShare();

  const handleReplace = () => {
    navigation.replace('UpdatingBackgroundMap', {shareId});
  };

  const handleCancel = () => {
    // Should this should pass a reason? Or not?
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <View style={styles.iconBackground}>
            <StackSvg width={47} height={50} color={NEW_DARK_GREY} />
          </View>
          <View style={styles.warningBadge}>
            <MaterialIcon name="error" size={30} color={RED} />
          </View>
        </View>

        <HeaderText variant="header2" style={styles.headerText}>
          {t(m.replaceMapTitle)}
        </HeaderText>

        <BodyText style={styles.descriptionText}>
          {t(m.replaceMapDescription)}
        </BodyText>
      </View>

      <View style={styles.buttonContainer}>
        <DestructiveButton
          fullSize
          text={t(m.yesReplace)}
          onPress={handleReplace}
          renderIcon={({color, size}) => (
            <StackSvg width={size * 0.75} height={size * 0.8} color={color} />
          )}
        />
        <SecondaryButton fullSize text={t(m.cancel)} onPress={handleCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: VERY_LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBadge: {
    position: 'absolute',
    right: -5,
    bottom: -5,
  },
  headerText: {
    textAlign: 'center',
  },
  descriptionText: {
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    gap: 12,
    alignItems: 'center',
  },
});
