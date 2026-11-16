import * as React from 'react';
import {StyleSheet} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../sharedComponents/Buttons';
import SuccessIcon from '../images/Success.svg';
import {
  type Exports,
  type NativeRootNavigationProps,
} from '../sharedTypes/navigation';
import {BLACK, NEW_DARK_GREY} from '../lib/styles';
import {ScreenContentWithButtonDockNoHeader} from '../sharedComponents/ScreenContentWithButtonDock/ScreenContentWithButtonDockNoHeader.tsx';

const m = defineMessages({
  title: {id: 'ExportSuccess.title', defaultMessage: 'Success!'},
  obs: {
    id: 'ExportSuccess.obs',
    defaultMessage:
      '<bold>All observations</bold> have been downloaded to your device.',
  },
  obsMedia: {
    id: 'ExportSuccess.obsMedia',
    defaultMessage:
      '<bold>All observations with media</bold> have been downloaded to your device.',
  },
  tracks: {
    id: 'ExportSuccess.tracks',
    defaultMessage: '<bold>Tracks</bold> have been downloaded to your device.',
  },
  done: {id: 'ExportSuccess.done', defaultMessage: 'Done'},
});

export type ExportSuccessParams = {exportType: Exports};

export const ExportSuccess = ({
  navigation,
  route,
}: NativeRootNavigationProps<'ExportSuccess'>) => {
  const {formatMessage: t} = useIntl();
  const {exportType} = route.params;

  const bodyMsg =
    exportType === 'Observation'
      ? m.obs
      : exportType === 'ObservationsWithMedia'
        ? m.obsMedia
        : m.tracks;

  return (
    <ScreenContentWithButtonDockNoHeader
      contentContainerStyle={styles.content}
      bottomButton={
        <SecondaryButton
          fullSize
          text={t(m.done)}
          onPress={() => navigation.goBack()}
        />
      }>
      <SuccessIcon />
      <HeaderText variant="header1" style={styles.title}>
        {t(m.title)}
      </HeaderText>

      <BodyText style={styles.description}>
        <FormattedMessage
          {...bodyMsg}
          values={{
            bold: (chunks: React.ReactNode) => (
              <HeaderText key={chunks?.toString()} variant="header5">
                {chunks}
              </HeaderText>
            ),
          }}
        />
      </BodyText>
    </ScreenContentWithButtonDockNoHeader>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 30,
  },
  title: {
    textAlign: 'center',
    color: BLACK,
  },
  description: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
    lineHeight: 30,
    paddingHorizontal: 10,
  },
});
