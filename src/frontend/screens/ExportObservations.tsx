import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {DARK_GREY, LIGHT_GREY, WARNING_RED} from '../lib/styles';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {useState} from 'react';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {UIActivityIndicator} from 'react-native-indicators';
import {useObservations} from '../hooks/server/observations';
import {useTracks} from '../hooks/server/track';
import * as Sentry from '@sentry/react-native';
import {isUserCancelled, useExportObservations} from '../hooks/server/projects';

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

export type Exports = 'Observation' | 'Tracks' | 'ObservationsWithMedia';

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
          navigation.navigate('ErrorBottomSheet');
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
                if (showError) {
                  setShowError(false);
                }
              }}
            />
            <ExportOptionCard
              title={formatMessage(m.allObservationsAndMedia)}
              description={formatMessage(m.allObservationsAndMediaDescription)}
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
      {!exportAndShare.isPending ? (
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
      <View style={{flex: 1}}>
        <HeaderText variant="header5">{title}</HeaderText>
        <BodyText variant="smallMeta">{description}</BodyText>
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
