import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes.ts';
import Exchange from '../images/Exchange.svg';
import {BodyText} from './Text/BodyText.tsx';
import {useProjectRoleAndDetails} from '../hooks/useProjectRoleAndDetails.ts';
import {BLUE_GREY, COMAPEO_BLUE, NEW_DARK_GREY, WHITE} from '../lib/styles.ts';
import {useActiveProject} from '../contexts/ActiveProjectContext.tsx';
import {MenuLowStorageAlert} from './Storage/MenuLowStorageAlert.tsx';
import {useStorageReadingQuery} from '../hooks/useStorageReadingQuery.ts';
import {isLowStorage, calcUsedPercentage} from '../lib/storage.ts';
import {ColorCard} from './ColorCard.tsx';
import {HeaderText} from './Text/HeaderText.tsx';
import {useManyProjects} from '@comapeo/core-react';
import {buttonStyles} from './Buttons.tsx';
import DownArrow from '../images/DownArrow.svg';

const m = defineMessages({
  aboutCoMapeo: {
    id: 'Navigation.Menu.aboutCoMapeo',
    defaultMessage: 'About CoMapeo',
  },
  appSettings: {
    id: 'Navigation.Menu.Settings',
    defaultMessage: 'App Settings',
  },
  privacyPolicy: {
    id: 'Navigation.Menu.privacyPolicy',
    defaultMessage: 'Data & Privacy',
  },
  currentProject: {
    id: 'Navigation.Menu.currentProject',
    defaultMessage: 'Current Project',
  },
  exchange: {
    id: 'Navigation.Menu.exchange',
    defaultMessage: 'Exchange',
  },
  invite: {
    id: 'Navigation.Menu.invite',
    defaultMessage: 'Invite',
  },
  viewProject: {
    id: 'Navigation.Menu.viewProject',
    defaultMessage: 'View',
  },
  allProjects: {
    id: 'Navigation.Menu.allProjects',
    defaultMessage: 'All Projects',
  },
  mappingOnOwn: {
    id: 'Navigation.Menu.mappingOnOwn',
    defaultMessage: 'You are mapping on your own.',
  },
  coordinator: {
    id: 'Navigation.Menu.coordinator',
    defaultMessage: 'Coordinator',
  },
  participant: {
    id: 'Navigation.Menu.participant',
    defaultMessage: 'Participant',
  },
  justYou: {
    id: 'Navigation.Menu.justYou',
    defaultMessage: 'Just you',
  },
  switchProjects: {
    id: 'Navigation.Menu.switchProjects',
    defaultMessage: 'Switch Projects',
  },
});

export function DrawerMenu() {
  const {formatMessage} = useIntl();
  const navigation = useNavigationFromRoot();
  const {data: allProjects} = useManyProjects();

  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {role, projectColor, projectDescription} = projectDetails;
  const {data} = useStorageReadingQuery();
  const {freeBytes, totalBytes} = data;
  const isLow = isLowStorage(freeBytes);
  const percentUsed = calcUsedPercentage(freeBytes, totalBytes);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isLow && (
          <MenuLowStorageAlert
            freeBytes={freeBytes}
            percentUsed={percentUsed}
          />
        )}
        <View>
          <ColorCard backgroundColor={projectColor}>
            <View style={{padding: 20, gap: 12}}>
              <HeaderText variant="header2">
                {role === 'solo'
                  ? projectDetails.projectHeader
                  : projectDetails.projectName}
              </HeaderText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                <MaterialIcon
                  color={NEW_DARK_GREY}
                  size={20}
                  name={
                    role === 'solo'
                      ? 'person'
                      : role === 'coordinator'
                        ? 'manage-accounts'
                        : 'people'
                  }
                />
                <BodyText style={{flex: 1, color: NEW_DARK_GREY}}>
                  {role === 'solo'
                    ? formatMessage(m.justYou)
                    : role === 'coordinator'
                      ? formatMessage(m.coordinator)
                      : formatMessage(m.participant)}
                </BodyText>
              </View>
              {(role === 'solo' || projectDescription) && (
                <BodyText style={{color: NEW_DARK_GREY}}>
                  {role === 'solo'
                    ? formatMessage(m.mappingOnOwn)
                    : projectDescription}
                </BodyText>
              )}
              {allProjects.length > 1 && (
                // This button deviates from the standard SecondaryButton (the icon is aligned flex-end) and so instead of changing that component, I just copied the styles here, and created a custom button for this use case.
                <TouchableOpacity
                  onPress={() => {
                    // This is temporary until we create the AllProjects bottom sheer. Navigating to this screen so we can update the project description and see that project description shows up on the menu
                    navigation.navigate('EditProjectDetails');
                  }}
                  style={[
                    buttonStyles.base,
                    {
                      backgroundColor: WHITE,
                      borderWidth: 1.5,
                      borderColor: BLUE_GREY,
                      alignSelf: 'center',
                      paddingHorizontal: 20,
                    },
                  ]}>
                  <HeaderText
                    variant="header5"
                    style={{color: COMAPEO_BLUE, flex: 1, textAlign: 'center'}}>
                    {formatMessage(m.switchProjects)}
                  </HeaderText>
                  <DownArrow />
                </TouchableOpacity>
              )}
            </View>
          </ColorCard>
        </View>

        <View style={styles.bottomItemsContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AllProjects')}
            accessibilityLabel="Go to All Projects Screen">
            <MaterialCommunityIcons
              name="dots-grid"
              size={20}
              color={NEW_DARK_GREY}
            />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">
                {formatMessage(m.allProjects)}
              </BodyText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Sync')}
            accessibilityLabel="Go to exchange screen.">
            <Exchange width={20} height={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">{formatMessage(m.exchange)}</BodyText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AppSettings')}
            accessibilityLabel="Go to app settings screen.">
            <IonIcon name="settings-outline" size={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">
                {formatMessage(m.appSettings)}
              </BodyText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('DataAndPrivacy')}
            accessibilityLabel="Go to data and privacy screen.">
            <Octicons name="shield-lock" size={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">
                {formatMessage(m.privacyPolicy)}
              </BodyText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AboutSettings')}
            accessibilityLabel="Go to about CoMapeo screen.">
            <MaterialIcon name="info-outline" size={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">
                {formatMessage(m.aboutCoMapeo)}
              </BodyText>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bottomItemsContainer: {
    gap: 20,
    paddingBottom: 20,
  },
  menuItem: {
    minHeight: 48,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
