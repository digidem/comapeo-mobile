import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {BLACK, LIGHT_GREY, WARNING_RED} from '../lib/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useState} from 'react';

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
  errorMessage: {
    id: 'screens.ExportObservations.errorMessage',
    defaultMessage: 'Choose an option',
  },
});

const EXPORT_OPTIONS = [
  {
    type: 'Observation',
    description: m.allObservationsDescription,
    title: m.allObservations,
  },
  {
    type: 'ObservationsWithMedia',
    description: m.allObservationsAndMediaDescription,
    title: m.allObservationsAndMedia,
  },
  {type: 'Tracks', title: m.tracks, description: m.tracksDescription},
] as const;
type Exports = (typeof EXPORT_OPTIONS)[number]['type'];

export const ExportObservations = ({
  navigation,
}: NativeRootNavigationProps<'ExportObservations'>) => {
  const {formatMessage} = useIntl();
  const [typeToExport, setTypeToExport] = useState<null | Exports>(null);
  const [showError, setShowError] = useState<boolean>(false);

  function handlePressDownload() {
    if (!typeToExport) {
      setShowError(true);
      return;
    }

    //handle download here
  }

  return (
    <BottomSheetWrapper>
      <View style={{alignItems: 'center', gap: 10}}>
        {EXPORT_OPTIONS.map(option => {
          const isSelected = typeToExport === option.type;
          const showErrorStyle = showError && !typeToExport;
          return (
            <TouchableOpacity
              key={option.type}
              style={styles.cardButton}
              onPress={() => {
                setTypeToExport(option.type);
                if (showError) {
                  setShowError(false);
                }
              }}>
              <MaterialIcon
                name={
                  isSelected ? 'radio-button-checked' : 'radio-button-unchecked'
                }
                color={showErrorStyle ? WARNING_RED : BLACK}
                size={30}
                style={{marginRight: 10}}
              />
              <View>
                <HeaderText variant="header5">
                  {formatMessage(option.title)}
                </HeaderText>
                <BodyText variant="smallMeta">
                  {formatMessage(option.description)}
                </BodyText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {showError && (
        <HeaderText
          variant="header5"
          style={{
            color: WARNING_RED,
            marginTop: 20,
            textAlign: 'center',
          }}>
          {formatMessage(m.errorMessage)}
        </HeaderText>
      )}
      <PrimaryButton
        fullSize={true}
        onPress={handlePressDownload}
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
