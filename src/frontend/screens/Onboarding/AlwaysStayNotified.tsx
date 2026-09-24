import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import RNRestart from 'react-native-restart';
import type {SvgProps} from 'react-native-svg';

import NotificationsUnread from '../../images/NotificationsUnread.svg';
import Refresh from '../../images/Refresh.svg';
import LocationIcon from '../../images/LocationIcon.svg';
import PhoneNotification from '../../images/PhoneNotification.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';
import {useNotificationPermission} from '../../hooks/usePermissions';
import {COMAPEO_BLUE, DARK_ORANGE, NEW_DARK_GREY} from '../../lib/styles';

const m = defineMessages({
  alwaysStayNotified: {
    id: '$1screens.StayNotified.StayNotified',
    defaultMessage: 'Always Stay Notified',
  },
  allowTheFollowing: {
    id: '$1screens.StayNotified.allowTheFollowing',
    defaultMessage: 'Notifications allow CoMapeo to do the following:',
  },
  notNow: {
    id: '$1screens.StayNotified.NotNow',
    defaultMessage: 'Not Now',
  },
  allow: {
    id: '$1screens.StayNotified.allow',
    defaultMessage: 'Allow',
  },
  realTimeCommunicate: {
    id: '$1screens.StayNotified.realTimeCommunicate',
    defaultMessage: 'Communicate about activity updates in real time.',
  },
  workInBackground: {
    id: '$1screens.StayNotified.workInBackground',
    defaultMessage:
      'Work in the background to ensure location stays current and accurate.',
  },
  securelySync: {
    id: '$1screens.StayNotified.SecurelySync',
    defaultMessage: 'Securely syncs and processes data with few interruptions.',
  },
});

/**
 * Restarts here instead of in device naming. It re-runs
 * getInitialRoute, which sends a named device with no project to Success. It
 * also applies the diagnostics choice made earlier in onboarding, which only
 * takes effect in the backend on a fresh start.
 */
export const AlwaysStayNotified = () => {
  const {formatMessage: t} = useIntl();
  const [isAsking, setIsAsking] = React.useState(false);
  const notifications = useNotificationPermission();

  async function handleAllow() {
    setIsAsking(true);
    await notifications.request();
    RNRestart.restart();
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <NotificationsUnread color={DARK_ORANGE} width={40} height={40} />
        <HeaderText variant="header2" style={styles.headerText}>
          {t(m.alwaysStayNotified)}
        </HeaderText>
      </View>

      <BodyText style={styles.bodyText}>{t(m.allowTheFollowing)}</BodyText>

      <View style={styles.bulletList}>
        <InfoListItem
          Icon={PhoneNotification}
          text={t(m.realTimeCommunicate)}
        />
        <InfoListItem Icon={LocationIcon} text={t(m.workInBackground)} />
        <InfoListItem Icon={Refresh} text={t(m.securelySync)} />
      </View>

      <View style={styles.actions}>
        {isAsking ? (
          <LoadingIndicator size="large" />
        ) : (
          <>
            <Pressable
              testID="ONBOARDING.notifications-not-now-btn"
              onPress={() => RNRestart.restart()}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
              <BodyText style={styles.notNow}>{t(m.notNow)}</BodyText>
            </Pressable>
            <PrimaryButton
              testID="ONBOARDING.notifications-allow-btn"
              fullSize
              text={t(m.allow)}
              onPress={handleAllow}
            />
          </>
        )}
      </View>
    </View>
  );
};

function InfoListItem({text, Icon}: {text: string; Icon: React.FC<SvgProps>}) {
  return (
    <View style={styles.bulletItem}>
      <Icon width={26} height={26} />
      <BodyText variant="smallMeta" style={styles.bulletText}>
        {text}
      </BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 60,
  },
  titleSection: {
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    marginTop: 10,
    textAlign: 'center',
  },
  bodyText: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bulletList: {
    gap: 12,
    paddingHorizontal: 20,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletText: {
    flexShrink: 1,
    color: NEW_DARK_GREY,
  },
  actions: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  notNow: {
    color: COMAPEO_BLUE,
  },
});
