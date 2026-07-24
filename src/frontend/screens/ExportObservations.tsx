import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {PrimaryButton} from '../sharedComponents/Buttons';
import {Exports, NativeRootNavigationProps} from '../sharedTypes/navigation';
import {DARK_GREY, LIGHT_GREY, WARNING_RED} from '../lib/styles';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {DownloadIcon} from '../sharedComponents/icons';
import {useState} from 'react';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {LoadingIndicator} from '../sharedComponents/LoadingIndicator';
import {useObservations} from '../hooks/server/observations';
import {useTracks} from '../hooks/server/track';
import * as Sentry from '@sentry/react-native';
import {isUserCancelled, useExportObservations} from '../hooks/server/projects';
import {toError} from '../utils/errors';

const m = defineMessages({
  download: {
    id: 'screens.ExportObservations.download',
    defaultMessage: 'Download',
  },
  downloadObservations: {
    id: 'screens.ExportObservations.downloadObservations',
    defaultMessage: 'Download Observations',
  },
  allObservations: {
    id: 'screens.ExportObservations.allObservations',
    defaultMessage: 'All Observations',
  },
  allObservationsDescription: {
    id: 'screens.ExportObservations.allObservationsDescription',
    defaultMessage: 'Text only as a GeoJSON file',
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
    defaultMessage: 'Tracks only as a GeoJSON file',
  },
  errorMessage: {
    id: 'screens.ExportObservations.errorMessage',
    defaultMessage: 'Choose an option',
  },
});

export const ExportObservations = ({
  navigation,
}: NativeRootNavigationProps<'ExportObservations'>) => {
  const {formatMessage} = useIntl();
  const [typeToExport, setTypeToExport] = useState<null | Exports>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const {data: observations} = useObservations();
  const {data: tracks} = useTracks();
  const {projectId} = useActiveProject();
  const exportAndShare = useExportObservations({projectId});

  async function handlePressDownload() {
    if (!typeToExport) {
      setShowError(true);
      return;
    }
    exportAndShare.mutate(
      {exportType: typeToExport},
      {
        onSuccess: () => {
          navigation.replace('ExportSuccess', {exportType: typeToExport});
        },
        onError: err => {
          if (isUserCancelled(err)) {
            return;
          }
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet', {
            error: toError(err, 'Error on export'),
          });
        },
      },
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.optionsContainer}>
          {observations.length > 0 && (
            <>
              <ExportOptionCard
                title={formatMessage(m.allObservations)}
                description={formatMessage(m.allObservationsDescription)}
                isSelected={typeToExport === 'Observation'}
                showError={showError && !typeToExport}
                onPress={() => {
                  setTypeToExport('Observation');
                  if (showError) {
                    setShowError(false);
                  }
                }}
              />
              <ExportOptionCard
                title={formatMessage(m.allObservationsAndMedia)}
                description={formatMessage(
                  m.allObservationsAndMediaDescription,
                )}
                isSelected={typeToExport === 'ObservationsWithMedia'}
                showError={showError && !typeToExport}
                onPress={() => {
                  setTypeToExport('ObservationsWithMedia');
                  if (showError) {
                    setShowError(false);
                  }
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
                if (showError) {
                  setShowError(false);
                }
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
      </View>
      <View style={styles.buttonContainer}>
        {!exportAndShare.isPending ? (
          <PrimaryButton
            fullSize={true}
            onPress={handlePressDownload}
            text={formatMessage(m.download)}
            renderIcon={({color, size}) => (
              <DownloadIcon color={color} size={size} />
            )}
          />
        ) : (
          <LoadingIndicator />
        )}
      </View>
    </View>
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
      <View style={{flex: 1}}>
        <HeaderText variant="header5">{title}</HeaderText>
        <BodyText variant="smallMeta">{description}</BodyText>
      </View>
    </TouchableOpacity>
  );
};

ExportObservations.navTitle = m.downloadObservations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  optionsContainer: {
    gap: 15,
  },
  buttonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  cardButton: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
    width: '100%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
