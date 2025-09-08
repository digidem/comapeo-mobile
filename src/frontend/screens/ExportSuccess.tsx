import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../sharedComponents/Buttons';
import SuccessIcon from '../images/Success.svg';
import {type NativeRootNavigationProps} from '../sharedTypes/navigation';
import {BLACK, NEW_DARK_GREY} from '../lib/styles';
import {type Exports} from './ExportObservations';

const m = defineMessages({
  title: {id: 'Export.Success.title', defaultMessage: 'Success!'},
  exportBody: {
    id: 'Export.Success.exportBody',
    defaultMessage: 'have been downloaded to your device.',
  },
  done: {id: 'Export.Success.done', defaultMessage: 'Done'},
  typeObservations: {
    id: 'Export.Success.typeObservations',
    defaultMessage: 'All Observations',
  },
  typeObservationsWithMedia: {
    id: 'Export.Success.typeObservationsWithMedia',
    defaultMessage: 'All Observations with Media',
  },
  typeTracks: {id: 'Export.Success.typeTracks', defaultMessage: 'Tracks'},
});

export type ExportSuccessParams = {exportType: Exports};

export const ExportSuccess = ({
  navigation,
  route,
}: NativeRootNavigationProps<'ExportSuccess'>) => {
  const {formatMessage: t} = useIntl();
  const {exportType} = route.params;

  const selectedtype =
    exportType === 'Observation'
      ? t(m.typeObservations)
      : exportType === 'ObservationsWithMedia'
        ? t(m.typeObservationsWithMedia)
        : t(m.typeTracks);

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', gap: 30}}>
        <SuccessIcon />
        <HeaderText
          variant="header1"
          style={{textAlign: 'center', color: BLACK}}>
          {t(m.title)}
        </HeaderText>

        <View style={{gap: 10}}>
          <HeaderText variant="header5" style={{textAlign: 'center'}}>
            {selectedtype}
          </HeaderText>
          <BodyText
            style={{
              textAlign: 'center',
              color: NEW_DARK_GREY,
              paddingHorizontal: 20,
            }}>
            {t(m.exportBody)}
          </BodyText>
        </View>
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
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between',
  },
});
