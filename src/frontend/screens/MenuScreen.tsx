import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes.ts';
import Exchange from '../images/Exchange.svg';
import {MainMenuItemWrapper} from '../sharedComponents/MainMenuItemWrapper.tsx';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import {Divider} from '../sharedComponents/Divider';
import {useProjectRoleAndDetails} from '../hooks/useProjectRoleAndDetails.ts';
import {NEW_DARK_GREY, BLACK, WHITE} from '../lib/styles';
import {useActiveProject} from '../contexts/ActiveProjectContext.tsx';
import {ProjectInfoCard} from '../sharedComponents/ProjectInfoCard.tsx';
import {MenuLowStorageAlert} from '../sharedComponents/Storage/MenuLowStorageAlert.tsx';
import {useStorageReadingQuery} from '../hooks/useStorageReadingQuery.ts';
import {isLowStorage, calcUsedPercentage} from '../lib/storage';

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
});

export function MenuScreen() {
  const {formatMessage} = useIntl();
  const navigation = useNavigationFromRoot();

  const {projectId} = useActiveProject();
  const projectInfo = useProjectRoleAndDetails(projectId);
  const role = projectInfo.role;

  const displayTitle =
    role === 'solo' ? projectInfo.projectHeader : projectInfo.projectName;

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
          <BodyText variant="tinyMeta" style={styles.currentProjectLabel}>
            {formatMessage(m.currentProject)}
          </BodyText>
          <ProjectInfoCard
            backgroundColor={projectInfo.projectColor}
            role={role}
            headerText={displayTitle}
            testID="MENU.project-name"
            projectDescription={
              'projectDescription' in projectInfo &&
              projectInfo.projectDescription
                ? projectInfo.projectDescription
                : undefined
            }
            ButtonsRow={
              <View style={styles.buttonsRow}>
                <View
                  style={styles.buttonWrapper}
                  accessibilityLabel="Go to Project Settings">
                  <SecondaryButton
                    text={formatMessage(m.viewProject)}
                    onPress={() => navigation.navigate('DidNotMoveBottomSheet')}
                    fullSize={false}
                  />
                </View>
                {role === 'coordinator' || role === 'solo' ? (
                  <View style={styles.buttonWrapper}>
                    <PrimaryButton
                      text={formatMessage(m.invite)}
                      onPress={() => {
                        if (role === 'solo') {
                          navigation.navigate('InviteCollaborators');
                          return;
                        }

                        navigation.navigate('SelectDevice');
                      }}
                      fullSize={false}
                      renderIcon={({size, color}) => (
                        <IonIcon name="person-add" size={size} color={color} />
                      )}
                    />
                  </View>
                ) : (
                  <View style={styles.buttonWrapper} />
                )}
              </View>
            }
          />
          <View style={{marginTop: 20}}>
            <Divider />
          </View>
        </View>

        <View style={styles.bottomItemsContainer}>
          <MainMenuItemWrapper
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
          </MainMenuItemWrapper>
          <MainMenuItemWrapper
            onPress={() => navigation.navigate('Sync')}
            accessibilityLabel="Go to exchange screen.">
            <Exchange width={20} height={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">{formatMessage(m.exchange)}</BodyText>
            </View>
          </MainMenuItemWrapper>
          <MainMenuItemWrapper
            onPress={() => navigation.navigate('AppSettings')}
            accessibilityLabel="Go to app settings screen.">
            <IonIcon name="settings-outline" size={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">
                {formatMessage(m.appSettings)}
              </BodyText>
            </View>
          </MainMenuItemWrapper>
          <MainMenuItemWrapper
            onPress={() => navigation.navigate('DataAndPrivacy')}
            accessibilityLabel="Go to data and privacy screen.">
            <Octicons name="shield-lock" size={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">
                {formatMessage(m.privacyPolicy)}
              </BodyText>
            </View>
          </MainMenuItemWrapper>
          <MainMenuItemWrapper
            onPress={() => navigation.navigate('AboutSettings')}
            accessibilityLabel="Go to about CoMapeo screen.">
            <MaterialIcon name="info-outline" size={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">
                {formatMessage(m.aboutCoMapeo)}
              </BodyText>
            </View>
          </MainMenuItemWrapper>
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
  currentProjectLabel: {
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: 12,
    color: BLACK,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
  bottomItemsContainer: {
    gap: 20,
    paddingBottom: 20,
  },
});
