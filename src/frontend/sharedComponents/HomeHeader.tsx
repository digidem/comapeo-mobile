import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {HeaderText} from './Text/HeaderText';
import {BLUE_GREY, DARK_GREY} from '../lib/styles';
import {useProjectRoleAndDetails} from '../hooks/useProjectRoleAndDetails';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {isLowStorage} from '../lib/storage';
import {useStorageReadingQuery} from '../hooks/useStorageReadingQuery';
import {ExclamationBadge} from './Storage/ExclamationBadge';

type HomeHeaderProps = BottomTabHeaderProps & {
  backgroundColor: string;
  showBottomBorder: boolean;
  toggleDrawer: () => void;
};

export function HomeHeader({
  backgroundColor,
  showBottomBorder,
  toggleDrawer,
}: HomeHeaderProps) {
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {data} = useStorageReadingQuery();
  const isLow = isLowStorage(data.freeBytes);

  const projectName =
    'projectHeader' in projectDetails
      ? projectDetails.projectHeader
      : projectDetails.projectName;

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
        <TouchableOpacity
          style={[
            styles.titleBox,
            {backgroundColor: projectDetails.projectColor},
          ]}
          onPress={toggleDrawer}
          accessibilityLabel="Open Menu"
          testID="HOME.header-button">
          <View style={styles.menuIconContainer}>
            <IonIcon name="menu" size={20} color={DARK_GREY} />
          </View>
          <HeaderText
            testID="HOME.header-title"
            variant="header4"
            style={styles.text}
            numberOfLines={1}
            ellipsizeMode="tail">
            {projectName}
          </HeaderText>
          {isLow && (
            <View style={{position: 'absolute', top: -2, right: -2}}>
              <ExclamationBadge testID="low-storage-badge" />
            </View>
          )}
        </TouchableOpacity>
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
    height: 40,
    maxWidth: '100%',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: BLUE_GREY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    flexShrink: 1,
  },
});
