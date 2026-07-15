import * as React from 'react';
import {AppState, Linking, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import RNRestart from 'react-native-restart';

import {
  BLUE_GREY,
  DARK_ORANGE,
  LIGHT_ORANGE,
  NEW_DARK_GREY,
  WHITE,
} from '../../lib/styles';
import DeployedCodeUpdateIcon from '../../images/DeployedCodeUpdate.svg';
import HardDriveDownloadIcon from '../../images/HardDriveDownload.svg';
import SafetyIcon from '../../images/Safety.svg';
import WarningIcon from '../../images/WarningYellow.svg';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  freeUpSpace: {
    id: 'screens.StorageMigration.NotEnoughSpace.freeUpSpace',
    defaultMessage: 'Free up space to continue.',
  },
  updateCoMapeo: {
    id: 'screens.StorageMigration.NotEnoughSpace.updateCoMapeo',
    defaultMessage: 'Update CoMapeo',
  },
  newUpdateAvailable: {
    id: 'screens.StorageMigration.NotEnoughSpace.newUpdateAvailable',
    defaultMessage: 'New update available with performance improvements',
  },
  spaceRequired: {
    id: 'screens.StorageMigration.NotEnoughSpace.spaceRequired',
    defaultMessage: '~340 MB required to update',
  },
  dataSafe: {
    id: 'screens.StorageMigration.NotEnoughSpace.dataSafe',
    defaultMessage: 'All data is safe and protected',
  },
  openStorageSettings: {
    id: 'screens.StorageMigration.NotEnoughSpace.openStorageSettings',
    defaultMessage: 'Open Storage Settings',
  },
  skipForNow: {
    id: 'screens.StorageMigration.NotEnoughSpace.skipForNow',
    defaultMessage: 'Skip for Now',
  },
});

export const NotEnoughSpace = ({onSkip}: {onSkip: () => void}) => {
  const {formatMessage: t} = useIntl();

  // When the user comesback from the system storage settings, restart the
  // app to re-check —migration then starts automatically if enough space was freed.
  const openedStorageSettings = React.useRef(false);
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', status => {
      if (status === 'active' && openedStorageSettings.current) {
        RNRestart.restart();
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.screen}>
      <ScreenContentWithDock
        contentContainerStyle={styles.contentContainer}
        dockContent={
          <View style={styles.buttonsContainer}>
            <PrimaryButton
              fullSize
              testID="STORAGE-MIGRATION.open-storage-settings-btn"
              text={t(m.openStorageSettings)}
              onPress={() => {
                openedStorageSettings.current = true;
                Linking.sendIntent(
                  'android.settings.INTERNAL_STORAGE_SETTINGS',
                );
              }}
            />
            <SecondaryButton
              fullSize
              testID="STORAGE-MIGRATION.skip-migration-btn"
              text={t(m.skipForNow)}
              onPress={onSkip}
            />
          </View>
        }>
        <View style={styles.alertBanner}>
          <WarningIcon width={26} height={26} />
          <HeaderText variant="header6">{t(m.freeUpSpace)}</HeaderText>
        </View>
        <View style={styles.centerContent}>
          <IconTitleDescription
            icon={
              <View style={styles.iconCircle}>
                <DeployedCodeUpdateIcon width={48} height={48} color={WHITE} />
              </View>
            }
            title={t(m.updateCoMapeo)}
            description={t(m.newUpdateAvailable)}
          />
          <View style={styles.infoRows}>
            <View style={styles.infoRow}>
              <HardDriveDownloadIcon width={26} height={26} />
              <BodyText variant="smallMeta" style={styles.infoText}>
                {t(m.spaceRequired)}
              </BodyText>
            </View>
            <View style={styles.infoRow}>
              <SafetyIcon width={26} height={26} />
              <BodyText variant="smallMeta" style={styles.infoText}>
                {t(m.dataSafe)}
              </BodyText>
            </View>
          </View>
        </View>
      </ScreenContentWithDock>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WHITE,
  },
  contentContainer: {
    flexGrow: 1,
    gap: 20,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 15,
    backgroundColor: LIGHT_ORANGE,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
  },
  centerContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: DARK_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRows: {
    gap: 12,
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    color: NEW_DARK_GREY,
  },
  buttonsContainer: {
    gap: 15,
    alignItems: 'center',
  },
});
