import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';

import DeviceIcon from '../images/DeviceIcon.svg';
import {IconButton} from './IconButton';
import {HeaderText} from './Text/HeaderText';
import {BLUE_GREY, DARK_GREY, DARK_ORANGE, WHITE} from '../lib/styles';
import {useProjectRoleAndDetails} from '../hooks/useProjectRoleAndDetails';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import ProjectCoordinatorIcon from '../images/ProjectCoordinator.svg';
import ProjectParticipantIcon from '../images/ProjectParticipant.svg';
import NoProjectIcon from '../images/NoProjectIcon.svg';
import {SvgProps} from 'react-native-svg';
import {
  useStorageReadingQuery,
  isLowStorage,
} from '../hooks/useStorageReadingQuery';

type HomeHeaderProps = BottomTabHeaderProps & {
  backgroundColor: string;
  showBottomBorder: boolean;
};

export function HomeHeader({
  backgroundColor,
  showBottomBorder,
  navigation,
}: HomeHeaderProps) {
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {data} = useStorageReadingQuery();
  const isLow = isLowStorage(data?.freeBytes ?? null);

  const projectName =
    'projectHeader' in projectDetails
      ? projectDetails.projectHeader
      : projectDetails.projectName;

  let RoleIcon: React.FC<SvgProps>;
  let testID: string;

  switch (projectDetails.role) {
    case 'coordinator':
      RoleIcon = ProjectCoordinatorIcon;
      testID = 'HOME.coordinator-icon';
      break;
    case 'participant':
      RoleIcon = ProjectParticipantIcon;
      testID = 'HOME.participant-icon';
      break;
    default:
      RoleIcon = NoProjectIcon;
      testID = 'HOME.no-project-icon';
      break;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderBottomWidth: showBottomBorder ? 1 : 0,
          borderBottomColor: showBottomBorder ? BLUE_GREY : 'transparent',
        },
      ]}>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.titleBox,
            {backgroundColor: projectDetails.projectColor},
          ]}>
          <RoleIcon testID={testID} style={{marginRight: 10}} />
          <HeaderText
            testID="HOME.header-title"
            variant="header4"
            style={styles.text}
            numberOfLines={1}
            ellipsizeMode="tail">
            {projectName}
          </HeaderText>
        </View>

        <IconButton
          style={styles.iconButton}
          onPress={() => {
            navigation.navigate('Menu');
          }}>
          <View style={styles.deviceWrap} pointerEvents="box-none">
            <DeviceIcon
              width={32}
              height={32}
              testID="drawer-icon-home"
              accessibilityLabel="Open Menu"
            />
            {isLow && (
              <View
                testID="low-storage-badge"
                accessibilityLabel="Low storage alert"
                style={styles.badge}
                pointerEvents="none">
                <Text style={styles.mark}>!</Text>
              </View>
            )}
          </View>
        </IconButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  headerRow: {
    width: '100%',
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBox: {
    width: '85%',
    minHeight: 32,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  text: {
    paddingLeft: 5,
    color: DARK_GREY,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceWrap: {
    width: 32,
    height: 32,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DARK_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    color: WHITE,
    fontSize: 7,
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
