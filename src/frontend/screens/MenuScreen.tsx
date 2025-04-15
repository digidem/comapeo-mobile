import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes.ts';
import Exchange from '../images/Exchange.svg';

import {MainMenuItemWrapper} from '../sharedComponents/MainMenuItemWrapper.tsx';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import {Divider} from '../sharedComponents/Divider';

import {useProjectRoleAndDetails} from '../hooks/useProjectRoleAndDetails.ts';

import {NEW_DARK_GREY, WHITE, VERY_LIGHT_GREY, BLACK} from '../lib/styles';
import {useActiveProject} from '../contexts/ActiveProjectContext.tsx';

const m = defineMessages({
  aboutCoMapeo: {
    id: 'Navigation.Menu.aboutCoMapeo',
    defaultMessage: 'About CoMapeo',
  },
  appSettings: {
    id: 'Navigation.Menu.Settings',
    defaultMessage: 'Settings',
  },
  privacyPolicy: {
    id: 'Navigation.Menu.privacyPolicy',
    defaultMessage: 'Data & Privacy',
  },
  mappingOnOwn: {
    id: 'Navigation.Menu.mappingOnOwn',
    defaultMessage: 'You are mapping on your own.',
  },
  coordinator: {
    id: 'Navigation.Menu.coordinator',
    defaultMessage: 'You are a coordinator on this project.',
  },
  participant: {
    id: 'Navigation.Menu.participant',
    defaultMessage: 'You are a participant on this project.',
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
});

export function MenuScreen() {
  const {formatMessage} = useIntl();
  const navigation = useNavigationFromRoot();

  const {projectId} = useActiveProject();
  const projectInfo = useProjectRoleAndDetails(projectId);

  const displayTitle =
    projectInfo.role === 'solo'
      ? projectInfo.projectHeader
      : projectInfo.projectName;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <BodyText variant="tinyMeta" style={styles.currentProjectLabel}>
            {formatMessage(m.currentProject)}
          </BodyText>
          <TouchableOpacity
            style={[
              styles.card,
              projectInfo.role === 'solo'
                ? styles.soloCard
                : styles.namedProjectCard,
            ]}
            onPress={() => navigation.navigate('ProjectSettings')}
            accessibilityLabel="Go to Project Settings">
            <HeaderText
              variant="header2"
              numberOfLines={2}
              testID="MENU.project-name">
              {displayTitle}
            </HeaderText>
            <BodyText variant="smallMeta" testID="MENU.project-status">
              {projectInfo.role === 'solo'
                ? formatMessage(m.mappingOnOwn)
                : projectInfo.role === 'coordinator'
                  ? formatMessage(m.coordinator)
                  : formatMessage(m.participant)}
            </BodyText>

            <View style={styles.buttonsRow}>
              <View
                style={styles.buttonWrapper}
                accessibilityLabel="Go to Project Settings">
                <SecondaryButton
                  text={formatMessage(m.viewProject)}
                  onPress={() => navigation.navigate('ProjectSettings')}
                  fullSize={false}
                />
              </View>
              {projectInfo.role === 'coordinator' ||
              projectInfo.role === 'solo' ? (
                <View style={styles.buttonWrapper}>
                  <PrimaryButton
                    text={formatMessage(m.invite)}
                    onPress={() => navigation.navigate('YourTeam')}
                    fullSize={false}
                    renderIcon={({size}) => (
                      <IonIcon name="person-add" size={size} color={WHITE} />
                    )}
                  />
                </View>
              ) : (
                <View style={styles.buttonWrapper} />
              )}
            </View>
          </TouchableOpacity>
          <View style={{marginTop: 20}}>
            <Divider />
          </View>
        </View>

        <View style={styles.bottomItemsContainer}>
          <MainMenuItemWrapper
            onPress={() => navigation.navigate('Sync')}
            accessibilityLabel="Go to Exchange Screen">
            <Exchange width={20} height={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">{formatMessage(m.exchange)}</BodyText>
            </View>
          </MainMenuItemWrapper>
          <MainMenuItemWrapper
            onPress={() => navigation.navigate('AppSettings')}
            accessibilityLabel="Go to App Settings">
            <IonIcon name="settings-outline" size={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">
                {formatMessage(m.appSettings)}
              </BodyText>
            </View>
          </MainMenuItemWrapper>
          <MainMenuItemWrapper
            onPress={() => navigation.navigate('DataAndPrivacy')}
            accessibilityLabel="Go to Data and Privacy Screen">
            <Octicons name="shield-lock" size={20} color={NEW_DARK_GREY} />
            <View style={{paddingLeft: 12}}>
              <BodyText variant="medium">
                {formatMessage(m.privacyPolicy)}
              </BodyText>
            </View>
          </MainMenuItemWrapper>
          <MainMenuItemWrapper
            onPress={() => navigation.navigate('AboutSettings')}
            accessibilityLabel="Go to About CoMapeo Screen">
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
  card: {
    borderWidth: 1,
    borderColor: VERY_LIGHT_GREY,
    borderRadius: 6,
    padding: 20,
    gap: 8,
    shadowColor: BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  soloCard: {
    backgroundColor: '#E5F0FF',
  },
  namedProjectCard: {
    backgroundColor: '#FFF5EB',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
  },
  bottomItemsContainer: {
    gap: 20,
    paddingBottom: 20,
  },
});
