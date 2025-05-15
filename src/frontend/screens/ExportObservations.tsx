import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {LIGHT_GREY} from '../lib/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {ReactNode, useState} from 'react';
import {ViewStyleProp} from '../sharedTypes';

const m = defineMessages({
  close: {
    id: 'screens.ExportObservations.close',
    defaultMessage: 'Close',
  },
  download: {
    id: 'screens.ExportObservations.download',
    defaultMessage: 'Download',
  },
  allObservations: {
    id: 'screens.ExportObservations.allObservations',
    defaultMessage: 'All Observations',
  },
  allObservationsDescription: {
    id: 'screens.ExportObservations.allObservationsDescription',
    defaultMessage: 'Text only as a GeoJson file',
  },
  allObservationsAndMedia: {
    id: 'screens.ExportObservations.allObservationsAndMedia',
    defaultMessage: 'All Observations with Media',
  },
  allObservationsAndMediaDescription: {
    id: 'screens.ExportObservations.allObservationsAndMediaDescription',
    defaultMessage: 'Images, audio, and video in a .zip file',
  },
  tracks: {
    id: 'screens.ExportObservations.tracks',
    defaultMessage: 'Tracks',
  },
  tracksDescription: {
    id: 'screens.ExportObservations.tracksDescription',
    defaultMessage: 'Tracks only as a GeoJson file',
  },
});

type Exports = 'Observation' | 'ObservationsWithMedia' | 'Tracks';

export const ExportObservations = ({
  navigation,
}: NativeRootNavigationProps<'ExportObservations'>) => {
  const {formatMessage} = useIntl();
  const [typeToExport, setTypeToExport] = useState<null | Exports>(null);

  return (
    <BottomSheetWrapper>
      <View style={{alignItems: 'center'}}>
        <ExportOptionCard
          value="Observation"
          style={{marginBottom: 10}}
          selectedValue={typeToExport}
          setSelectedValue={setTypeToExport}>
          <View>
            <HeaderText variant="header5">
              {formatMessage(m.allObservations)}
            </HeaderText>
            <BodyText variant="smallMeta">
              {formatMessage(m.allObservationsDescription)}
            </BodyText>
          </View>
        </ExportOptionCard>
        <ExportOptionCard
          value="ObservationsWithMedia"
          selectedValue={typeToExport}
          style={{marginBottom: 10}}
          setSelectedValue={setTypeToExport}>
          <View>
            <HeaderText variant="header5">
              {formatMessage(m.allObservationsAndMedia)}
            </HeaderText>
            <BodyText variant="smallMeta">
              {formatMessage(m.allObservationsAndMediaDescription)}
            </BodyText>
          </View>
        </ExportOptionCard>
        <ExportOptionCard
          value="Tracks"
          selectedValue={typeToExport}
          setSelectedValue={setTypeToExport}>
          <View>
            <HeaderText variant="header5">{formatMessage(m.tracks)}</HeaderText>
            <BodyText variant="smallMeta">
              {formatMessage(m.tracksDescription)}
            </BodyText>
          </View>
        </ExportOptionCard>
      </View>
      <PrimaryButton
        fullSize={true}
        onPress={() => {}}
        style={{marginTop: 20, alignSelf: 'center'}}
        text={formatMessage(m.download)}
      />
      <SecondaryButton
        fullSize={true}
        onPress={() => navigation.goBack()}
        style={{marginTop: 20, alignSelf: 'center'}}
        text={formatMessage(m.close)}
      />
    </BottomSheetWrapper>
  );
};

type ExportOptionCardProps = {
  value: Exports;
  selectedValue: Exports | null;
  setSelectedValue: (val: Exports) => void;
  children: ReactNode;
  style?: ViewStyleProp;
};

export const ExportOptionCard = ({
  value,
  setSelectedValue,
  selectedValue,
  children,
  style,
}: ExportOptionCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.cardButton, style]}
      onPress={() => setSelectedValue(value)}>
      <MaterialIcon
        name={
          value === selectedValue
            ? 'radio-button-checked'
            : 'radio-button-unchecked'
        }
        size={30}
        style={{marginRight: 10}}
      />
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardButton: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
    width: '100%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
  },
});
