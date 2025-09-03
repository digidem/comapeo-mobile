import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

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
            onPress={() => {
              navigation.navigate('OnboardingPrivacyPolicy');
            }}
          />
          <PrimaryButton
            fullSize
            text={t(m.next)}
            onPress={() => {
              navigation.navigate('DeviceNaming');
            }}
          />
        </View>
      }>
      <View style={styles.headerArea}>
        <CoMapeoShield width={64} height={80} />
        <HeaderText variant="header1" style={styles.title} numberOfLines={2}>
          {t(m.dataPrivacyTitle)}
        </HeaderText>
        <BodyText style={styles.introText}>
          {t(m.dataPrivacyDescription)}
        </BodyText>
      </View>

      <View style={styles.bodyContainer}>
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
    gap: 30,
    paddingTop: 30,
    flexWrap: 'wrap',
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  introText: {
    paddingHorizontal: 30,
    lineHeight: 21,
    textAlign: 'center',
  },
  bodyContainer: {
    gap: 20,
    alignSelf: 'center',
    paddingTop: 20,
    paddingHorizontal: 45,
  },
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulletText: {
    lineHeight: 18,
    flexShrink: 1,
    color: NEW_DARK_GREY,
  },
  buttonsContainer: {
    gap: 15,
  },
});

export default DataPrivacy;
