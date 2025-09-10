import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../sharedComponents/Buttons';
import SuccessIcon from '../images/Success.svg';
import {type NativeRootNavigationProps} from '../sharedTypes/navigation';
import {BLACK, NEW_DARK_GREY} from '../lib/styles';
import {type Exports} from './ExportObservations';

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
    <View style={styles.container}>
      <View style={{alignItems: 'center', gap: 30}}>
        <SuccessIcon />
        <HeaderText
          variant="header1"
          style={{textAlign: 'center', color: BLACK}}>
          {t(m.title)}
        </HeaderText>

        <BodyText
          style={{
            textAlign: 'center',
            color: NEW_DARK_GREY,
            lineHeight: 30,
            paddingHorizontal: 10,
          }}>
          <FormattedMessage
            {...bodyMsg}
            values={{
              bold: (chunks: React.ReactNode) => (
                <HeaderText variant="header5">{chunks}</HeaderText>
              ),
            }}
          />
        </BodyText>
      </View>

      <View>
        <SecondaryButton
          fullSize
          text={t(m.done)}
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
