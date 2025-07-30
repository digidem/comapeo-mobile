import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import FingerPressingIcon from '../images/FingerPressingButtonOrange.svg';
import PuzzlePieceIcon from '../images/PuzzlePiece.svg';
import RedOutlinedExIcon from '../images/RedOutlinedEx.svg';
import SwitchIcon from '../images/Switch.svg';

import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {SvgProps} from 'react-native-svg';
import {NEW_DARK_GREY} from '../lib/styles';
import {AppStackParamsList} from '../sharedTypes/navigation';

import {
  useAppUsageStatsPromptActions,
  useAppUsageStatsPromptState,
} from '../contexts/AppUsageStatsPromptContext';
import {shouldShowAppUsagePrompt} from '../lib/shouldShowAppUsagePrompt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const m = defineMessages({
  screenTitle: {
    id: 'screens.AppUsagePrompt.screenTitle',
    defaultMessage: 'Help improve your experience.',
  },
  introText: {
    id: 'screens.AppUsagePrompt.introText',
    defaultMessage:
      'Share how you use CoMapeo—any data shared cannot be used to track you.',
  },
  idsScrambled: {
    id: 'screens.AppUsagePrompt.idsScrambled',
    defaultMessage: 'IDs are scrambled randomly and changed every month.',
  },
  neverStores: {
    id: 'screens.AppUsagePrompt.neverStores',
    defaultMessage: 'CoMapeo never stores IP addresses.',
  },
  turnOffAnytime: {
    id: 'screens.AppUsagePrompt.turnOffAnytime',
    defaultMessage: 'Turn off at any time.',
  },
  notNow: {
    id: 'screens.AppUsagePrompt.notNow',
    defaultMessage: 'No, not now',
  },
  countIn: {
    id: 'screens.AppUsagePrompt.countIn',
    defaultMessage: 'Yes, count me in',
  },
});

export const AppUsagePromptInterstitial = ({
  navigation,
}: NativeStackScreenProps<
  AppStackParamsList,
  'AppUsagePromptInterstitial'
>) => {
  const {formatMessage: t} = useIntl();
  const {setOptedIn} = useAppUsageStatsPromptActions();
  const showPrompt = shouldShowAppUsagePrompt(
    useAppUsageStatsPromptState(s => s),
  );

  React.useEffect(() => {
    if (!showPrompt) {
      navigation.replace('Home', {screen: 'Map'});
    }
  }, [showPrompt, navigation]);

  return (
    <ScreenContentWithDock
      dockContent={
        <View style={styles.buttonsContainer}>
          <SecondaryButton
            fullSize
            text={t(m.notNow)}
            onPress={() => {
              setOptedIn(false);
            }}
          />
          <PrimaryButton
            fullSize
            text={t(m.countIn)}
            onPress={() => {
              navigation.navigate('AppUsageSharingSuccess');
            }}
          />
        </View>
      }>
      <View style={styles.headerArea}>
        <FingerPressingIcon width={60} height={110} />
        <HeaderText variant="header1" style={styles.title} numberOfLines={2}>
          {t(m.screenTitle)}
        </HeaderText>
        <BodyText style={styles.introText}>{t(m.introText)}</BodyText>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.bulletList}>
          <InfoListItem Icon={PuzzlePieceIcon} text={t(m.idsScrambled)} />
          <InfoListItem Icon={RedOutlinedExIcon} text={t(m.neverStores)} />
          <InfoListItem Icon={SwitchIcon} text={t(m.turnOffAnytime)} />
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
  bodyContainer: {
    gap: 20,
    alignSelf: 'center',
    paddingTop: 20,
    paddingHorizontal: 45,
  },
  introText: {
    paddingHorizontal: 30,
    lineHeight: 21,
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
