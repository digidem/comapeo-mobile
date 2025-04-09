import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Animated, {SlideInRight, SlideOutRight} from 'react-native-reanimated';
import {useIntl, defineMessages} from 'react-intl';

import DeviceIcon from '../images/DeviceIcon.svg';
import {CloseIcon} from './icons';
import {useProjectRole} from '../hooks/useProjectRole';
import {useProjectSettings} from '../hooks/server/projects';
import {
  WHITE,
  BLUE_GREY,
  NEW_DARK_GREY,
  VERY_LIGHT_GREY,
  BLACK,
} from '../lib/styles';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Exchange from '../images/Exchange.svg';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {BodyText} from './Text/BodyText';
import {HeaderText} from './Text/HeaderText';
import {PrimaryButton, SecondaryButton} from './Buttons';

const m = defineMessages({
  aboutCoMapeo: {
    id: 'Navigation.Menu.aboutCoMapeo',
    defaultMessage: 'About CoMapeo',
    description: "Primary text for 'About CoMapeo' link (version info)",
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
    defaultMessage: 'You are mapping on your own',
  },
  coordinator: {
    id: 'Navigation.Menu.coordinator',
    defaultMessage: 'You are a coordinator on this project',
  },
  participant: {
    id: 'Navigation.Menu.participant',
    defaultMessage: 'You are a participant on this project',
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
  const {data} = useProjectSettings();
  const {navigate} = useNavigationFromRoot();
  const {data: deviceData} = useOwnDeviceInfo();
  const {formatMessage} = useIntl();

  const deviceName = deviceData?.name;
  const role = useProjectRole(data);
  const projectName = data?.name || 'My Solo Project';

  return (
    <Animated.View
      style={styles.container}
      entering={SlideInRight.duration(250)}
      exiting={SlideOutRight.duration(250)}>
      <View style={[styles.topBar, styles.gapRow]}>
        <View style={[styles.deviceRow, styles.gapRow]}>
          <DeviceIcon width={32} height={32} />
          <HeaderText variant="header4">{deviceName}</HeaderText>
        </View>

        <TouchableOpacity onPress={closeMenu} accessibilityLabel="Close Menu">
          <CloseIcon size={32} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContainer, styles.gapColumn]}>
        <BodyText variant="tinyMeta" style={styles.currentProjectLabel}>
          {formatMessage(m.currentProject)}
        </BodyText>

        <View
          style={[
            styles.card,
            role === 'solo' ? styles.soloCard : styles.namedProjectCard,
          ]}>
          <View style={styles.cardContent}>
            <HeaderText variant="header2" numberOfLines={2}>
              {projectName}
            </HeaderText>
            <BodyText variant="smallMeta">
              {role === 'solo'
                ? formatMessage(m.mappingOnOwn)
                : role === 'coordinator'
                  ? formatMessage(m.coordinator)
                  : formatMessage(m.participant)}
            </BodyText>
            <View style={styles.buttonsRow}>
              <View style={styles.buttonWrapper}>
                <SecondaryButton
                  onPress={() => navigate('ProjectSettings')}
                  text={formatMessage(m.viewProject)}
                  fullSize={false}
                />
              </View>

              {(role === 'coordinator' || role === 'solo') && (
                <View style={styles.buttonWrapper}>
                  <PrimaryButton
                    text={formatMessage(m.invite)}
                    fullSize={false}
                    onPress={() => {
                      console.log('invite button pressed');
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={[styles.menuItems, styles.gapColumn]}>
          <TouchableOpacity
            style={[styles.menuItemRow, styles.gapRow]}
            accessibilityLabel="Go to Exchange Screen"
            onPress={() => {
              navigate('Sync');
            }}>
            <Exchange width={20} height={20} color={NEW_DARK_GREY} />
            <HeaderText variant="header4">
              {formatMessage(m.exchange)}
            </HeaderText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItemRow, styles.gapRow]}
            onPress={() => {
              navigate('AppSettings');
            }}
            accessibilityLabel="Go to App Settings">
            <IonIcon name="settings-outline" size={20} color={NEW_DARK_GREY} />
            <HeaderText variant="header4">
              {formatMessage(m.appSettings)}
            </HeaderText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItemRow, styles.gapRow]}
            onPress={() => {
              navigate('DataAndPrivacy');
            }}
            accessibilityLabel="Go to Data and Privacy Screen">
            <Octicons name="shield-lock" size={20} color={NEW_DARK_GREY} />
            <HeaderText variant="header4">
              {formatMessage(m.privacyPolicy)}
            </HeaderText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItemRow, styles.gapRow]}
            onPress={() => {
              navigate('AboutSettings');
            }}
            accessibilityLabel="Go to About CoMapeo Screen">
            <MaterialIcon name="info-outline" size={20} color={NEW_DARK_GREY} />
            <HeaderText variant="header4">
              {formatMessage(m.aboutCoMapeo)}
            </HeaderText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: WHITE,
    borderColor: BLUE_GREY,
    borderWidth: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 58,
    borderBottomColor: BLUE_GREY,
    borderBottomWidth: 1,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  currentProjectLabel: {
    marginTop: 20,
    marginBottom: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: VERY_LIGHT_GREY,
    padding: 20,
    shadowColor: BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  soloCard: {
    backgroundColor: '#E5F0FF',
  },
  namedProjectCard: {
    backgroundColor: '#FFF5EB',
  },
  buttonWrapper: {
    flex: 1,
  },
  gapColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  gapRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  menuItems: {
    flexGrow: 1,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
