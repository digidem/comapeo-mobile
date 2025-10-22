import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import ProjectIcon from '../../images/ObservationsProject.svg';
import IndexPointingUp from '../../images/IndexPointingUp.svg';
import LockedWithKey from '../../images/LockedWithKey.svg';
import GreenCheck from '../../images/GreenSquareCheckmark.svg';

import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {SvgProps} from 'react-native-svg';
import {DARK_ORANGE, NEW_DARK_GREY} from '../../lib/styles';

const m = defineMessages({
  screenTitle: {
    id: 'soloProject.startNewProject.title',
    defaultMessage: 'Start New Project',
  },
  introText: {
    id: 'soloProject.startNewProject.introText',
    defaultMessage: 'Secure and private way to exchange with collaborators.',
  },
  uniqueProject: {
    id: 'soloProject.startNewProject.uniqueProject',
    defaultMessage: 'Each project is unique and separate.',
  },
  inviteOnly: {
    id: 'soloProject.startNewProject.inviteOnly',
    defaultMessage: 'Only devices invited to a project can contribute.',
  },
  manageControl: {
    id: 'soloProject.startNewProject.manageControl',
    defaultMessage: 'Easily manage project contributors and settings.',
  },
  goBack: {
    id: 'soloProject.startNewProject.goBack',
    defaultMessage: 'Go Back',
  },
  start: {
    id: 'soloProject.startNewProject.start',
    defaultMessage: 'Start',
  },
});

type Props = NativeRootNavigationProps<'StartNewProject'>;

export const StartNewProjectScreen: React.FC<Props> = ({navigation}) => {
  const {formatMessage: t} = useIntl();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleStart() {
    navigation.replace('CreateProject');
  }

  return (
    <ScreenContentWithDock
      dockContent={
        <View style={styles.buttonsContainer}>
          <SecondaryButton
            fullSize={true}
            text={t(m.goBack)}
            onPress={handleGoBack}
          />
          <PrimaryButton
            fullSize={true}
            text={t(m.start)}
            onPress={handleStart}
          />
        </View>
      }>
      <View style={styles.headerArea}>
        <ProjectIcon color={DARK_ORANGE} width={90} height={90} />
        <HeaderText variant="header1" style={styles.title} numberOfLines={2}>
          {t(m.screenTitle)}
        </HeaderText>
        <BodyText style={styles.introText}>{t(m.introText)}</BodyText>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.bulletList}>
          <InfoListItem Icon={IndexPointingUp} text={t(m.uniqueProject)} />
          <InfoListItem Icon={LockedWithKey} text={t(m.inviteOnly)} />
          <InfoListItem Icon={GreenCheck} text={t(m.manageControl)} />
        </View>
      </View>
    </ScreenContentWithDock>
  );
};

function InfoListItem({text, Icon}: {text: string; Icon: React.FC<SvgProps>}) {
  return (
    <View style={styles.bulletItem}>
      <Icon width={20} height={26} style={styles.bulletIcon} />
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
    paddingTop: 40,
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
  bulletIcon: {
    marginTop: 0,
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
