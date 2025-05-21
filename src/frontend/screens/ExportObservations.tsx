import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {DARK_GREY, LIGHT_GREY, WARNING_RED} from '../lib/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useState} from 'react';
import {useExportGeoJSON, useExportZipFile} from '@comapeo/core-react';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import * as FileSystem from 'expo-file-system';
import {useOpenShareDialog} from '../hooks/share';
import {useLocaleState} from '../contexts/LocaleStoreContext';
import {UIActivityIndicator} from 'react-native-indicators';
import {useObservations} from '../hooks/server/observations';
import {useTracks} from '../hooks/server/track';
import * as Sentry from '@sentry/react-native';

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
    defaultMessage: 'Images and audio in a .zip file',
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
  const {projectId} = useActiveProject();
  const exportNoMedia = useExportGeoJSON({projectId});
  const exportWithMedia = useExportZipFile({projectId});
  const [loading, setLoading] = useState(false);
  const openShare = useOpenShareDialog();
  const lang = useLocaleState(store => store.languageTag);
  const {data: observations} = useObservations();
  const {data: tracks} = useTracks();

  async function handlePressDownload() {
    if (!typeToExport) {
      setShowError(true);
      return;
    }
    setLoading(true);
    const exportDir = FileSystem.cacheDirectory + 'exports/';
    const exportDirectory = await FileSystem.getInfoAsync(exportDir);

    if (!exportDirectory.exists) {
      await FileSystem.makeDirectoryAsync(exportDir);
    }

    function shareMutate(path: string) {
      openShare.mutate(
        {
          url: `file://${path}`,
        },
        {onSettled: () => setLoading(false)},
      );
    }

    if (typeToExport === 'Observation' || typeToExport === 'Tracks') {
      exportNoMedia.mutate(
        {
          path: normalizeFilePath(exportDir),
          exportOptions: {
            lang: lang || 'en',
            observations: typeToExport === 'Observation',
            tracks: typeToExport === 'Tracks',
          },
        },
        {
          onSuccess: async path => {
            shareMutate(path);
          },
          onError: err => {
            Sentry.captureException(err);
            navigation.replace('ErrorBottomSheet');
          },
        },
      );

      return;
    }

    // Export with media
    exportWithMedia.mutate(
      {
        path: normalizeFilePath(exportDir),
        exportOptions: {
          lang: lang || 'en',
          observations: true,
          tracks: true,
          attachments: true,
        },
      },
      {
        onSuccess: async path => {
          shareMutate(path);
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.replace('ErrorBottomSheet');
        },
      },
    );
  }

  return (
    <BottomSheetWrapper>
      <View style={{alignItems: 'center', gap: 10}}>
        {EXPORT_OPTIONS.map(option => {
          //if no tracks, dont show tracks option
          if (tracks.length === 0 && option.type === 'Tracks') {
            return;
          }

          //if no observations, dont show observations options
          if (
            observations.length === 0 &&
            (option.type === 'Observation' ||
              option.type === 'ObservationsWithMedia')
          ) {
            return;
          }
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
                color={showErrorStyle ? WARNING_RED : DARK_GREY}
                size={30}
                style={{marginRight: 10}}
              />
              <View>
                <HeaderText style={{flex: 1}} variant="header5">
                  {formatMessage(option.title)}
                </HeaderText>
                <BodyText style={{flex: 1}} variant="smallMeta">
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
      {!loading ? (
        <>
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
        </>
      ) : (
        <UIActivityIndicator style={{paddingTop: 60, paddingBottom: 40}} />
      )}
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
const normalizeFilePath = (uri: string) => {
  return uri.replace(/^file:\/\//, '');
};
