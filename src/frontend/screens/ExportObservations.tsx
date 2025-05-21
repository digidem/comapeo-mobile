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

type Exports = 'Observation' | 'Tracks' | 'ObservationsWithMedia';

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
        {observations.length > 0 && (
          <>
            <ExportOptionCard
              title={formatMessage(m.allObservations)}
              description={formatMessage(m.allObservationsDescription)}
              isSelected={typeToExport === 'Observation'}
              showError={showError && !typeToExport}
              onPress={() => {
                setTypeToExport('Observation');
              }}
            />
            <ExportOptionCard
              title={formatMessage(m.allObservationsAndMedia)}
              description={formatMessage(m.allObservationsAndMediaDescription)}
              isSelected={typeToExport === 'ObservationsWithMedia'}
              showError={showError && !typeToExport}
              onPress={() => {
                setTypeToExport('ObservationsWithMedia');
              }}
            />
          </>
        )}
        {tracks.length > 0 && (
          <ExportOptionCard
            title={formatMessage(m.tracks)}
            description={formatMessage(m.tracksDescription)}
            isSelected={typeToExport === 'Tracks'}
            showError={showError && !typeToExport}
            onPress={() => {
              setTypeToExport('Tracks');
            }}
          />
        )}
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

type ExportOptionCardProps = {
  title: string;
  description: string;
  isSelected: boolean;
  showError: boolean;
  onPress: () => void;
};

export const ExportOptionCard = ({
  title,
  description,
  isSelected,
  showError,
  onPress,
}: ExportOptionCardProps) => {
  return (
    <TouchableOpacity style={styles.cardButton} onPress={onPress}>
      <MaterialIcon
        name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
        color={showError ? WARNING_RED : DARK_GREY}
        size={30}
        style={{marginRight: 10}}
      />
      <View>
        <HeaderText style={{flex: 1}} variant="header5">
          {title}
        </HeaderText>
        <BodyText style={{flex: 1}} variant="smallMeta">
          {description}
        </BodyText>
      </View>
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
const normalizeFilePath = (uri: string) => {
  return uri.replace(/^file:\/\//, '');
};
