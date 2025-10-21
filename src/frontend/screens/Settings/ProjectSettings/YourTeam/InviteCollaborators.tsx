import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import AddPerson from '../../../../images/AddPerson.svg';
import LockedWithKey from '../../../../images/LockedWithKey.svg';
import Handshake from '../../../../images/HandshakeMediumMediumDark.svg';
import Checkmark from '../../../../images/GreenSquareCheckmark.svg';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {ScreenContentWithDock} from '../../../../sharedComponents/ScreenContentWithDock';
import {SvgProps} from 'react-native-svg';
import {NEW_DARK_GREY, DARK_ORANGE} from '../../../../lib/styles';

const m = defineMessages({
  screenTitle: {
    id: 'soloProject.inviteCollaborators.title',
    defaultMessage: 'Invite Collaborators',
  },
  introText: {
    id: 'soloProject.inviteCollaborators.introText',
    defaultMessage: 'Share observations with others using CoMapeo.',
  },
  nameProjectDescription: {
    id: 'soloProject.inviteCollaborators.nameProjectDescription',
    defaultMessage: 'Name your project to start collaborating.',
  },
  inviteOnly: {
    id: 'soloProject.inviteCollaborators.inviteOnly',
    defaultMessage: 'Only devices invited to this project can contribute.',
  },
  manageControl: {
    id: 'soloProject.inviteCollaborators.manageControl',
    defaultMessage: 'Easily manage project contributors and settings.',
  },
  goBack: {
    id: 'soloProject.inviteCollaborators.goBack',
    defaultMessage: 'Go Back',
  },
  nameMyProject: {
    id: 'soloProject.inviteCollaborators.nameProject',
    defaultMessage: 'Name My Project',
  },
});

type Props = NativeRootNavigationProps<'InviteCollaborators'>;

export const InviteCollaboratorsScreen: React.FC<Props> = ({navigation}) => {
  const {formatMessage: t} = useIntl();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleNameProject() {
    navigation.replace('NameSoloProject');
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
            text={t(m.nameMyProject)}
            onPress={handleNameProject}
          />
        </View>
      }>
      <View style={styles.headerArea}>
        <AddPerson width={86} height={80} color={DARK_ORANGE} />
        <HeaderText variant="header1" style={styles.title} numberOfLines={2}>
          {t(m.screenTitle)}
        </HeaderText>
        <BodyText variant="regular" style={styles.introText}>
          {t(m.introText)}
        </BodyText>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.bulletList}>
          <InfoListItem Icon={Handshake} text={t(m.nameProjectDescription)} />
          <InfoListItem Icon={LockedWithKey} text={t(m.inviteOnly)} />
          <InfoListItem Icon={Checkmark} text={t(m.manageControl)} />
        </View>
      </View>
    </ScreenContentWithDock>
  );
};

function InfoListItem({text, Icon}: {text: string; Icon: React.FC<SvgProps>}) {
  return (
    <View style={styles.bulletItem}>
      <Icon width={20} height={26} />
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
