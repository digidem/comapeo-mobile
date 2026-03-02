import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import GreenCheckSvg from '../../images/Success.svg';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

const m = defineMessages({
  // primary-string
  customMapAddedTitle: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.customMapAddedTitle',
    defaultMessage: 'Custom Map Added',
  },
  customMapAddedDescription: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.customMapAddedDescription',
    defaultMessage:
      'You will see this map when you are offline, but you will not see a map outside the area defined in your custom map.',
  },
  // primary-string
  close: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.close',
    defaultMessage: 'Close',
  },
});

export const MapAddedBottomSheet = () => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <GreenCheckSvg />
        </View>

        <HeaderText variant="header2" style={styles.title}>
          {t(m.customMapAddedTitle)}
        </HeaderText>

        <BodyText variant="large" style={styles.description}>
          {t(m.customMapAddedDescription)}
        </BodyText>

        <View style={styles.buttonsContainer}>
          <SecondaryButton
            fullSize
            text={t(m.close)}
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
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  buttonsContainer: {
    alignItems: 'center',
  },
});
