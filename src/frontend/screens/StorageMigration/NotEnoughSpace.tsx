import * as React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

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
  const {formatMessage} = useIntl();

  return (
    <View style={styles.container}>
      <View style={styles.alertBanner}>
        <WarningIcon width={26} height={26} />
        <HeaderText variant="header6">
          {formatMessage(m.freeUpSpace)}
        </HeaderText>
      </View>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <DeployedCodeUpdateIcon width={48} height={48} color={WHITE} />
        </View>
        <HeaderText variant="header2" style={styles.centeredText}>
          {formatMessage(m.updateCoMapeo)}
        </HeaderText>
        <BodyText style={styles.centeredText}>
          {formatMessage(m.newUpdateAvailable)}
        </BodyText>
        <View style={styles.infoRows}>
          <View style={styles.infoRow}>
            <HardDriveDownloadIcon width={26} height={26} />
            <BodyText variant="smallMeta" style={styles.infoText}>
              {formatMessage(m.spaceRequired)}
            </BodyText>
          </View>
          <View style={styles.infoRow}>
            <SafetyIcon width={26} height={26} />
            <BodyText variant="smallMeta" style={styles.infoText}>
              {formatMessage(m.dataSafe)}
            </BodyText>
          </View>
        </View>
      </View>
      <View style={styles.buttons}>
        <PrimaryButton
          fullSize
          testID="SERVER-LOADING.open-storage-settings-btn"
          text={formatMessage(m.openStorageSettings)}
          onPress={() => {
            Linking.sendIntent('android.settings.INTERNAL_STORAGE_SETTINGS');
          }}
        />
        <SecondaryButton
          fullSize
          testID="SERVER-LOADING.skip-migration-btn"
          text={formatMessage(m.skipForNow)}
          onPress={onSkip}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 20,
    alignItems: 'center',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    alignSelf: 'stretch',
    padding: 15,
    backgroundColor: LIGHT_ORANGE,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: DARK_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
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
  buttons: {
    gap: 15,
    alignItems: 'center',
  },
});
