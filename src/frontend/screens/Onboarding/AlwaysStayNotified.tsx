import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import type {SvgProps} from 'react-native-svg';

import NotifiedIcon from '../../images/Notified.svg';
import Refresh from '../../images/Refresh.svg';
import LocationIcon from '../../images/LocationIcon.svg';
import PhoneNotification from '../../images/PhoneNotification.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {
  requestNotificationPermission,
  useInvalidateNotificationPermission,
  useNotificationPermissionWithoutPasscode,
} from '../../hooks/useNotificationPermissionTracker';
import type {OnboardingParamsList} from '../../sharedTypes/navigation';
import {COMAPEO_BLUE, NEW_DARK_GREY} from '../../lib/styles';

const m = defineMessages({
  alwaysStayNotified: {
    id: '$1screens.StayNotified.StayNotified',
    defaultMessage: 'Always Stay Notified',
  },
  allowTheFollowing: {
    id: 'screens.StayNotified.allowTheFollowing',
    defaultMessage: 'Notifications allow CoMapeo to do the following:',
  },
  notNow: {
    id: 'screens.StayNotified.NotNow',
    defaultMessage: 'Not Now',
  },
  allow: {
    id: 'screens.StayNotified.allow',
    defaultMessage: 'Allow',
  },
  realTimeCommunicate: {
    id: 'screens.StayNotified.realTimeCommunicate',
    defaultMessage: 'Communicate about activity updates in real time.',
  },
  workInBackground: {
    id: 'screens.StayNotified.workInBackground',
    defaultMessage:
      'Work in the background to ensure location stays current and accurate.',
  },
  securelySync: {
    id: 'screens.StayNotified.SecurelySync',
    defaultMessage: 'Securely syncs and processes data with few interruptions.',
  },
});

const ICON_SIZE = 72;

export const AlwaysStayNotified = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'AlwaysStayNotified'>) => {
  const {formatMessage: t} = useIntl();
  const invalidateNotificationPermission =
    useInvalidateNotificationPermission();

  const askNotificationPermission = useNotificationPermissionWithoutPasscode(
    async () => {
      await requestNotificationPermission();
      await invalidateNotificationPermission();
      navigation.replace('Success');
    },
  );

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.content}
      dockContainerStyle={styles.actions}
      dockContent={
        askNotificationPermission.status === 'pending' ? (
          <LoadingIndicator size="large" />
        ) : (
          <>
            <Pressable
              testID="ONBOARDING.notifications-not-now-btn"
              style={styles.notNowButton}
              onPress={() => navigation.replace('Success')}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
              <BodyText style={styles.notNow}>{t(m.notNow)}</BodyText>
            </Pressable>
            <PrimaryButton
              testID="ONBOARDING.notifications-allow-btn"
              fullSize
              text={t(m.allow)}
              onPress={() => askNotificationPermission.mutate()}
              renderIcon={({color, size}) => (
                <MaterialIcons
                  name="check-circle-outline"
                  color={color}
                  size={size}
                />
              )}
            />
          </>
        )
      }>
      <View style={styles.titleSection}>
        <NotifiedIcon width={ICON_SIZE} height={ICON_SIZE} />
        <HeaderText variant="header2">{t(m.alwaysStayNotified)}</HeaderText>
      </View>

      <View style={styles.benefitsSection}>
        <BodyText style={styles.introText}>{t(m.allowTheFollowing)}</BodyText>

        <View style={styles.bulletList}>
          <InfoListItem
            Icon={PhoneNotification}
            text={t(m.realTimeCommunicate)}
          />
          <InfoListItem Icon={LocationIcon} text={t(m.workInBackground)} />
          <InfoListItem Icon={Refresh} text={t(m.securelySync)} />
        </View>
      </View>
    </ScreenContentWithDock>
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
  content: {
    paddingHorizontal: 40,
    gap: 20,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    gap: 10,
  },
  benefitsSection: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 30,
  },
  introText: {
    textAlign: 'center',
  },
  bulletList: {
    alignSelf: 'stretch',
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletText: {
    flexShrink: 1,
    color: NEW_DARK_GREY,
    lineHeight: 18,
  },
  actions: {
    gap: 10,
  },
  notNowButton: {
    height: 50,
    justifyContent: 'center',
  },
  notNow: {
    color: COMAPEO_BLUE,
  },
});
