import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {QuestionMarkWithShadow} from '../../sharedComponents/icons/QuestionMarkWithShadow';

const m = defineMessages({
  title: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.title',
    defaultMessage: 'What is Included',
  },
  close: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.close',
    defaultMessage: 'Close',
  },
  observations: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.observations',
    defaultMessage: 'Observations (including photos and audio)',
  },
  tracks: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.tracks',
    defaultMessage: 'Tracks',
  },
  deviceNames: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.deviceNames',
    defaultMessage: 'Device Names',
  },
  projectSettings: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.projectSettings',
    defaultMessage: 'Project Settings (categories, questions)',
  },
});

export const WhatsIncludedBottomSheet = () => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();

  const description =
    `\u2022 ` +
    t(m.observations) +
    '\n' +
    `\u2022 ` +
    t(m.tracks) +
    '\n' +
    `\u2022 ` +
    t(m.deviceNames) +
    '\n' +
    `\u2022 ` +
    t(m.projectSettings);

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <QuestionMarkWithShadow
            style={{marginTop: 30}}
            width={60}
            height={60}
          />
        </View>

        <HeaderText variant="header2" style={styles.title}>
          {t(m.title)}
        </HeaderText>

        <BodyText variant="large" style={styles.description}>
          {description}
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
  },
  iconContainer: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'left',
    paddingBottom: 20,
  },
  buttonsContainer: {
    gap: 16,
    alignItems: 'center',
  },
});
