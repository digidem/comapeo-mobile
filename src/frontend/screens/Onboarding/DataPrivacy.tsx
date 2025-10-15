import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import CoMapeoShield from '../../images/CoMapeoShield.svg';
import LockedWithKeyIcon from '../../images/LockedWithKey.svg';
import HandshakeMediumMediumDarkIcon from '../../images/HandshakeMediumMediumDark.svg';
import SafetyIcon from '../../images/Safety.svg';

import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {SvgProps} from 'react-native-svg';
import {NEW_DARK_GREY} from '../../lib/styles';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {m} from './DataPrivacyMessages';

export const DataPrivacy = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'DataPrivacy'>) => {
  const {formatMessage: t} = useIntl();

  return (
    <ScreenContentWithDock
      dockContent={
        <View style={styles.buttonsContainer}>
          <SecondaryButton
            fullSize
            text={t(m.learnMore)}
            iconPosition="left"
            renderIcon={({color, size}) => (
              <MaterialIcons name="info-outline" color={color} size={size} />
            )}
            onPress={() => {
              navigation.navigate('OnboardingPrivacyPolicy');
            }}
          />
          <PrimaryButton
            fullSize
            text={t(m.next)}
            iconPosition="right"
            renderIcon={({color, size}) => (
              <Ionicons
                name="arrow-forward-circle-outline"
                color={color}
                size={size}
              />
            )}
            onPress={() => {
              navigation.replace('DeviceNaming');
            }}
          />
        </View>
      }>
      <View style={styles.headerArea}>
        <CoMapeoShield width={60} height={60} />
        <HeaderText variant="header2" style={styles.title}>
          {t(m.dataPrivacyTitle)}
        </HeaderText>
      </View>

      <View style={styles.bodyContainer}>
        <BodyText style={styles.introText}>{t(m.dataPrivacyIntro)}</BodyText>
        <View style={styles.bulletList}>
          <InfoListItem Icon={LockedWithKeyIcon} text={t(m.dataPrivacyStays)} />
          <InfoListItem
            Icon={HandshakeMediumMediumDarkIcon}
            text={t(m.dataPrivacyManageAndControl)}
          />
          <InfoListItem Icon={SafetyIcon} text={t(m.dataPrivacyDiagnostic)} />
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
  headerArea: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 10,
    paddingTop: 60,
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bodyContainer: {
    gap: 30,
    alignSelf: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  introText: {
    textAlign: 'center',
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
  buttonsContainer: {
    gap: 10,
  },
});
