import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IonIcon from '@react-native-vector-icons/ionicons';
import Octicons from '@react-native-vector-icons/octicons';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes.ts';
import Exchange from '../images/Exchange.svg';
import CollaborateIcon from '../images/ProjectParticipant.svg';
import {BodyText} from '../sharedComponents/Text/BodyText.tsx';
import {useProjectRoleAndDetails} from '../hooks/useProjectRoleAndDetails.ts';
import {
  BLUE_GREY,
  COMAPEO_BLUE,
  LIGHT_ORANGE,
  NEW_DARK_GREY,
  WHITE,
} from '../lib/styles.ts';
import {useActiveProject} from '../contexts/ActiveProjectContext.tsx';
import {MenuLowStorageAlert} from '../sharedComponents/Storage/MenuLowStorageAlert.tsx';
import {useStorageReadingQuery} from '../hooks/useStorageReadingQuery.ts';
import {ColorCard} from '../sharedComponents/ColorCard.tsx';
import {HeaderText} from '../sharedComponents/Text/HeaderText.tsx';
import {useManyProjects} from '@comapeo/core-react';
import {buttonStyles, PrimaryButton} from '../sharedComponents/Buttons.tsx';
import DownArrow from '../images/DownArrow.svg';
import {isLowStorage, calcUsedPercentage} from '../lib/storage';
import {useEarlyAccessState} from '../contexts/EarlyAccessContext';

const m = defineMessages({
  appSettings: {
    id: '$1Navigation.Menu.Settings',
    defaultMessage: 'CoMapeo Settings',
  },
  bgMap: {
    id: '$1Navigation.Menu.bgMap',
    defaultMessage: 'Background Map',
  },
  gatherObservations: {
    id: '$1Navigation.Menu.gatherObservations',
    defaultMessage: 'Gather Observations',
  },
  currentProject: {
    id: '$1Navigation.Menu.currentProject',
    defaultMessage: 'Current Project',
  },
  exchange: {
    id: '$1Navigation.Menu.exchange',
    defaultMessage: 'Exchange',
  },
  mappingOnOwn: {
    id: '$1Navigation.Menu.mappingOnOwn',
    defaultMessage: "You're mapping on your own.",
  },
  coordinator: {
    id: '$1Navigation.Menu.coordinator',
    defaultMessage: 'Coordinator',
  },
  participant: {
    id: '$1Navigation.Menu.participant',
    defaultMessage: 'Participant',
  },
  justYou: {
    id: '$1Navigation.Menu.justYou',
    defaultMessage: 'Just You',
  },
  switchProject: {
    id: '$1Navigation.Menu.switchProject',
    defaultMessage: 'Switch Project',
  },
  earlyAccessOn: {
    id: '$1Navigation.Menu.earlyAccessOn',
    defaultMessage: 'Early Access ON',
  },
  earlyAccessTurnOff: {
    id: '$1Navigation.Menu.earlyAccessTurnOff',
    defaultMessage: 'Turn Off',
  },
  team: {
    id: '$1Navigation.Menu.team',
    defaultMessage: 'Team',
  },
  coordinatorTools: {
    id: '$1Navigation.Menu.coordinatorTools',
    defaultMessage: 'Coordinator Tools',
  },
  collaborate: {
    id: '$1Navigation.Menu.collaborate',
    defaultMessage: 'Collaborate',
  },
});
export function DrawerMenu({closeMenu}: {closeMenu: () => void}) {
  const {formatMessage} = useIntl();
  const navigation = useNavigationFromRoot();
  const {data: allProjects} = useManyProjects();

  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {role, projectColor, projectDescription, projectHeader} =
    projectDetails;
  const {data} = useStorageReadingQuery();
  const {freeBytes, totalBytes} = data;
  const isLow = isLowStorage(freeBytes);
  const percentUsed = calcUsedPercentage(freeBytes, totalBytes);

  const isEarly = useEarlyAccessState(s => s.isEarlyAccessEnabled);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topCardsContainer}>
          {isLow && (
            <MenuLowStorageAlert
              freeBytes={freeBytes}
              percentUsed={percentUsed}
            />
          )}
          {isEarly ? (
            <View style={styles.earlyAccessAlert}>
              <View style={styles.earlyAccessRow}>
                <MaterialIcon name="flag" size={20} color={NEW_DARK_GREY} />
                <HeaderText variant="header6" style={styles.earlyAccessLabel}>
                  {formatMessage(m.earlyAccessOn)}
                </HeaderText>
                <BodyText
                  variant="tinyMeta"
                  style={styles.earlyAccessTurnOff}
                  onPress={() => navigation.navigate('EarlyAccess')}>
                  {formatMessage(m.earlyAccessTurnOff)}
                </BodyText>
              </View>
            </View>
          ) : null}
          <ColorCard backgroundColor={projectColor}>
            <View style={{padding: 20, gap: 12}}>
              <HeaderText variant="header2">{projectHeader}</HeaderText>
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
                    navigation.navigate('AllProjects');
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
                    {formatMessage(m.switchProject)}
                  </HeaderText>
                  <DownArrow />
                </TouchableOpacity>
              )}
            </View>
          </ColorCard>
        </View>

        <View style={styles.bottomItemsContainer}>
          {role !== 'solo' && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('YourTeam');
              }}
              accessibilityLabel="Go to your team screen.">
              <MaterialIcon color={NEW_DARK_GREY} size={20} name={'people'} />
              <BodyText variant="medium" style={{paddingLeft: 12}}>
                {formatMessage(m.team)}
              </BodyText>
            </TouchableOpacity>
          )}
          {role === 'coordinator' && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('ProjectSettings');
              }}
              accessibilityLabel="Go to project settings screen.">
              <MaterialIcon
                color={NEW_DARK_GREY}
                size={20}
                name={'manage-accounts'}
              />
              <BodyText variant="medium" style={{paddingLeft: 12}}>
                {formatMessage(m.coordinatorTools)}
              </BodyText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.popTo('Home', {screen: 'Map'});
              closeMenu();
            }}
            accessibilityLabel="Go to map screen.">
            <Octicons name="plus-circle" size={20} color={NEW_DARK_GREY} />
            <BodyText variant="medium" style={{paddingLeft: 12}}>
              {formatMessage(m.gatherObservations)}
            </BodyText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('BackgroundMaps')}
            accessibilityLabel="Go to background maps screen.">
            <MaterialIcon name="layers" size={20} color={NEW_DARK_GREY} />
            <BodyText variant="medium" style={{paddingLeft: 12}}>
              {formatMessage(m.bgMap)}
            </BodyText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AppSettings')}
            accessibilityLabel="Go to app settings screen.">
            <IonIcon name="settings-outline" size={20} color={NEW_DARK_GREY} />
            <BodyText variant="medium" style={{paddingLeft: 12}}>
              {formatMessage(m.appSettings)}
            </BodyText>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={{marginBottom: 20, marginHorizontal: 20}}>
        <PrimaryButton
          testID="MENU.main-action-button"
          style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 280,
          }}
          onPress={() => {
            if (role === 'solo') {
              navigation.navigate('Collaborate');
              return;
            }
            navigation.navigate('Sync');
          }}
          fullSize={false}
          text={formatMessage(role === 'solo' ? m.collaborate : m.exchange)}
          renderIcon={
            role === 'solo'
              ? () => <CollaborateIcon color={WHITE} />
              : () => <Exchange color={WHITE} />
          }
        />
      </View>
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
  topCardsContainer: {
    gap: 12,
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
  earlyAccessAlert: {
    backgroundColor: LIGHT_ORANGE,
    borderWidth: 0.5,
    borderColor: BLUE_GREY,
    borderRadius: 6,
    padding: 15,
  },
  earlyAccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  earlyAccessLabel: {
    flex: 1,
  },
  earlyAccessTurnOff: {
    color: COMAPEO_BLUE,
  },
});
