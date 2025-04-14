import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import DeviceIcon from '../images/DeviceIcon.svg';
import Exchange from '../images/Exchange.svg';
import {CloseIcon} from './icons';

import {MenuListItem} from './MenuList/MenuListItem';
import {HeaderText} from './Text/HeaderText';
import {BodyText} from './Text/BodyText';
import {PrimaryButton, SecondaryButton} from './Buttons';
import {Divider} from './Divider';

import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {useProjectRole} from '../hooks/useProjectRole';
import {useProjectSettings} from '../hooks/server/projects';

import {
  NEW_DARK_GREY,
  WHITE,
  BLUE_GREY,
  VERY_LIGHT_GREY,
  BLACK,
} from '../lib/styles';

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

type MenuContentProps = {
  closeMenu: () => void;
};

export function MenuContent({closeMenu}: MenuContentProps) {
  const {data: deviceData} = useOwnDeviceInfo();
  const {data: projectData} = useProjectSettings();
  const role = useProjectRole(projectData);
  const {formatMessage} = useIntl();
  const {navigate} = useNavigationFromRoot();

  const deviceName = deviceData?.name;
  const projectName = projectData?.name || 'My Solo Project';

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.deviceRow}>
          <DeviceIcon width={32} height={32} />
          <HeaderText variant="header4">{deviceName}</HeaderText>
        </View>
        <TouchableOpacity onPress={closeMenu} accessibilityLabel="Close Menu">
          <CloseIcon size={32} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <BodyText variant="tinyMeta" style={styles.currentProjectLabel}>
            {formatMessage(m.currentProject)}
          </BodyText>
          <TouchableOpacity
            style={[
              styles.card,
              role === 'solo' ? styles.soloCard : styles.namedProjectCard,
            ]}
            onPress={() => navigate('ProjectSettings')}
            accessibilityLabel="Go to Project Settings">
            <HeaderText
              variant="header2"
              numberOfLines={2}
              testID="MENU.project-name">
              {projectName}
            </HeaderText>
            <BodyText variant="smallMeta" testID="MENU.project-status">
              {role === 'solo'
                ? formatMessage(m.mappingOnOwn)
                : role === 'coordinator'
                  ? formatMessage(m.coordinator)
                  : formatMessage(m.participant)}
            </BodyText>

            <View style={styles.buttonsRow}>
              <View
                style={styles.buttonWrapper}
                accessibilityLabel="Go to Project Settings">
                <SecondaryButton
                  text={formatMessage(m.viewProject)}
                  onPress={() => navigate('ProjectSettings')}
                  fullSize={false}
                />
              </View>
              {role === 'coordinator' || role === 'solo' ? (
                <View style={styles.buttonWrapper}>
                  <PrimaryButton
                    text={formatMessage(m.invite)}
                    onPress={() => {
                      if (role === 'solo') {
                        navigate('InviteCollaborators');
                      } else {
                        navigate('SelectDevice');
                      }
                    }}
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
          <MenuItem
            item={{
              icon: <Exchange width={20} height={20} color={NEW_DARK_GREY} />,
              onPress: () => navigate('Sync'),
              primaryText: formatMessage(m.exchange),
              accessibilityLabel: 'Go to Exchange Screen',
            }}
          />
          <MenuItem
            item={{
              icon: (
                <IonIcon
                  name="settings-outline"
                  size={20}
                  color={NEW_DARK_GREY}
                />
              ),
              onPress: () => navigate('AppSettings'),
              primaryText: formatMessage(m.appSettings),
              accessibilityLabel: 'Go to App Settings',
            }}
          />
          <MenuItem
            item={{
              icon: (
                <Octicons name="shield-lock" size={20} color={NEW_DARK_GREY} />
              ),
              onPress: () => navigate('DataAndPrivacy'),
              primaryText: formatMessage(m.privacyPolicy),
              accessibilityLabel: 'Go to Data and Privacy Screen',
            }}
          />
          <MenuItem
            item={{
              icon: (
                <MaterialIcon
                  name="info-outline"
                  size={20}
                  color={NEW_DARK_GREY}
                />
              ),
              onPress: () => navigate('AboutSettings'),
              primaryText: formatMessage(m.aboutCoMapeo),
              accessibilityLabel: 'Go to About CoMapeo Screen',
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function MenuItem(
  props: Omit<
    React.ComponentProps<typeof MenuListItem>,
    'paddingLeft' | 'paddingRight' | 'columnGap'
  >,
) {
  return (
    <MenuListItem
      {...props}
      paddingLeft={0}
      paddingRight={15}
      columnGap={15}
      style={{paddingVertical: 10}}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 58,
    borderBottomWidth: 1,
    borderBottomColor: BLUE_GREY,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
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
