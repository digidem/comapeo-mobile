import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {Bar as ProgressBar} from 'react-native-progress';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  BLUE_GREY,
  COMAPEO_BLUE,
  DARK_ORANGE,
  LIGHT_GREY,
  LIGHT_ORANGE,
  NEW_DARK_GREY,
  WHITE,
} from '../../lib/styles';
import DeployedCodeUpdateIcon from '../../images/DeployedCodeUpdate.svg';
import SafetyIcon from '../../images/Safety.svg';
import StopwatchIcon from '../../images/Stopwatch.svg';
import WarningIcon from '../../images/WarningYellow.svg';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  doNotClose: {
    id: 'screens.StorageMigration.Migrating.doNotClose',
    defaultMessage: 'Do not close app while updating!',
  },
  updatingCoMapeo: {
    id: 'screens.StorageMigration.Migrating.updatingCoMapeo',
    defaultMessage: 'Updating CoMapeo…',
  },
  projectsMigrating: {
    id: 'screens.StorageMigration.Migrating.projectsMigrating',
    defaultMessage: 'Projects are migrating to a newer, faster format',
  },
  updatingCount: {
    id: 'screens.StorageMigration.Migrating.updatingCount',
    defaultMessage: 'Updating {done} of {total}…',
  },
  dataSafe: {
    id: 'screens.StorageMigration.Migrating.dataSafe',
    defaultMessage: 'All data is safe and protected',
  },
});

export const Migrating = ({
  progress,
}: {
  progress: {done: number; total: number} | null;
}) => {
  const {formatMessage: t} = useIntl();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.alertBanner}>
        <WarningIcon width={26} height={26} />
        <HeaderText variant="header6">{t(m.doNotClose)}</HeaderText>
      </View>
      <View style={styles.content}>
        <IconTitleDescription
          icon={
            <View style={styles.iconCircle}>
              <DeployedCodeUpdateIcon width={48} height={48} color={WHITE} />
            </View>
          }
          title={t(m.updatingCoMapeo)}
          description={t(m.projectsMigrating)}
        />
      </View>
      <View style={styles.progressSection}>
        <MaterialIcon name="sync" size={16} color={COMAPEO_BLUE} />
        <ProgressBar
          {...(progress
            ? {progress: progress.done / progress.total, indeterminate: false}
            : {indeterminate: true, indeterminateAnimationDuration: 2000})}
          height={10}
          width={null}
          borderRadius={5}
          color={COMAPEO_BLUE}
          unfilledColor={LIGHT_GREY}
          borderWidth={0}
        />
      </View>
      <View style={styles.infoRows}>
        {progress && (
          <View style={styles.infoRow}>
            <StopwatchIcon width={26} height={26} />
            <BodyText variant="smallMeta" style={styles.infoText}>
              {t(m.updatingCount, {
                done: progress.done,
                total: progress.total,
              })}
            </BodyText>
          </View>
        )}
        <View style={styles.infoRow}>
          <SafetyIcon width={26} height={26} />
          <BodyText variant="smallMeta" style={styles.infoText}>
            {t(m.dataSafe)}
          </BodyText>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 20,
    alignItems: 'center',
    gap: 20,
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
    justifyContent: 'flex-end',
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
  progressSection: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    gap: 5,
  },
  infoRows: {
    flex: 1,
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
});
