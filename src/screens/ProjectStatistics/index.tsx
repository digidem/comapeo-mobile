import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';

import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {Checkbox} from '../../sharedComponents/Checkbox';
import {BLUE_GREY, NEW_DARK_GREY} from '../../lib/styles';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../hooks/useProjectRoleAndDetails';
import {
  useProjectSettings,
  useUpdateProjectSettings,
} from '@comapeo/core-react';
import * as Sentry from '@sentry/react-native';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  navTitle: {
    id: 'screens.ProjectStatistics.navTitle',
    defaultMessage: 'Project Statistics',
  },
  statisticsDescription: {
    id: 'screens.ProjectStatistics.statisticsDescription',
    defaultMessage:
      'Anonymized information about your project including number of observations, areas covered, stats about track distance and time, stats about attachments, and number of participants.',
  },
  statsShared: {
    id: 'screens.ProjectStatistics.statsShared',
    defaultMessage: 'Project stats are shared with Awana Digital',
  },
  shareLabel: {
    id: 'screens.ProjectStatistics.shareLabel',
    defaultMessage: 'Share Project Statistics',
  },
});

export const ProjectStatistics = ({
  navigation,
}: NativeRootNavigationProps<'ProjectStatistics'>) => {
  const {formatMessage} = useIntl();
  const {projectId} = useActiveProject();
  const roleInfo = useProjectRoleAndDetails(projectId);
  const isCoordinator = roleInfo.role === 'coordinator';

  const {data: settings} = useProjectSettings({projectId});
  const {mutate: updateSettings, status} = useUpdateProjectSettings({
    projectId,
  });

  function handleToggle() {
    if (!isCoordinator || status === 'pending') return;
    updateSettings(
      {sendStats: !settings.sendStats},
      {
        onSuccess: data => {
          if (data.sendStats === false) {
            navigation.navigate('ProjectStatsTurnedOff');
          }
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet', {error: err});
        },
      },
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoBox}>
        <HeaderText variant="header6">{formatMessage(m.navTitle)}</HeaderText>
        <BodyText variant="smallMeta" style={styles.sectionText}>
          {formatMessage(m.statisticsDescription)}
        </BodyText>

        <View style={styles.bulletRow}>
          <MaterialIcons
            name="circle"
            size={4}
            color={NEW_DARK_GREY}
            style={styles.bulletIcon}
          />
          <BodyText variant="smallMeta" style={styles.bulletText}>
            {formatMessage(m.statsShared)}
          </BodyText>
        </View>

        {isCoordinator ? (
          <>
            <View style={styles.horizontalLine} />
            <View style={styles.toggleRow}>
              <BodyText variant="smallMeta" style={{flex: 1}}>
                {formatMessage(m.shareLabel)}
              </BodyText>
              {status === 'pending' ? (
                <LoadingIndicator size="small" style={{flex: 0}} />
              ) : (
                <Checkbox
                  testID={
                    settings.sendStats
                      ? 'PROJECT_SETTINGS.stats-on'
                      : 'PROJECT_SETTINGS.stats-off'
                  }
                  value={settings.sendStats}
                  error={false}
                  disabled={false}
                  onPress={handleToggle}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                />
              )}
            </View>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
};

ProjectStatistics.navTitle = m.navTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  infoBox: {
    padding: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    gap: 10,
  },
  sectionText: {
    color: NEW_DARK_GREY,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 10,
    paddingLeft: 10,
  },
  bulletIcon: {marginTop: 10},
  bulletText: {color: NEW_DARK_GREY},
  horizontalLine: {
    borderBottomColor: BLUE_GREY,
    borderBottomWidth: 1,
    marginVertical: 14,
    marginHorizontal: -20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
