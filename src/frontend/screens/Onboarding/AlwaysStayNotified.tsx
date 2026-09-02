import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import Notified from '../../images/Notified.svg';
import Refresh from '../../images/Refresh.svg';
import LocationIcon from '../../images/LocationIcon.svg';
import PhoneNotification from '../../images/PhoneNotifcation.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {NEW_DARK_GREY} from '../../lib/styles';
import {SvgProps} from 'react-native-svg';

const m = defineMessages({
  AlwaysStayNotified: {
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
  SecurelySync: {
    id: '$1screens.StayNotified.SecurelySync',
    defaultMessage: 'Securely syncs and processes data with few interruptions.',
  },
});
export const Success = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'Success'>) => {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Notified width={40} height={60} />
        <HeaderText variant="header2" style={styles.headerText}>
          {t(m.AlwaysStayNotified)}
        </HeaderText>
      </View>
      <BodyText style={{textAlign: 'center'}}>
        {t(m.allowTheFollowing)}
      </BodyText>
      <View style={styles.bulletList}>
        <InfoListItem
          Icon={PhoneNotification}
          text={t(m.realTimeCommunicate)}
        />
        <InfoListItem Icon={LocationIcon} text={t(m.workInBackground)} />
        <InfoListItem Icon={Refresh} text={t(m.SecurelySync)} />
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          testID="ONBOARDING.join-project-btn"
          fullSize
          text={t(m.allow)}
          iconPosition="left"
          onPress={() => {
            navigation.navigate('JoinProjectIntro');
          }}
        />
        <SecondaryButton
          testID="ONBOARDING.map-on-your-own-btn"
          fullSize
          text={t(m.notNow)}
          iconPosition="left"

          onPress={() => {
            navigation.navigate('MapOnYourOwnIntro');
          }}
        />
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
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  actions: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
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
});
