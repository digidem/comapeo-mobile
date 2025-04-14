import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import AddPersonOrange from '../../../../images/AddPersonOrange.svg';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../../sharedComponents/Buttons';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {WHITE, BLUE_GREY, NEW_DARK_GREY} from '../../../../lib/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const m = defineMessages({
  screenTitle: {
    id: 'soloProject.inviteCollaborators.title',
    defaultMessage: 'Invite Collaborators',
  },
  introText: {
    id: 'soloProject.inviteCollaborators.introText',
    defaultMessage:
      'Share observations with others using CoMapeo. Name your solo project to add your first collaborator.',
  },
  readyToShare: {
    id: 'soloProject.inviteCollaborators.readyToShare',
    defaultMessage:
      'Once you name your project, all your observations are ready to be shared.',
  },
  inviteOnly: {
    id: 'soloProject.inviteCollaborators.inviteOnly',
    defaultMessage:
      'Only devices you invite can contribute and share data with you.',
  },
  manageControl: {
    id: 'soloProject.inviteCollaborators.manageControl',
    defaultMessage:
      'Manage and control sharing and collaboration in Project Settings.',
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

export const InviteCollaboratorsScreen: NativeNavigationComponent<
  'InviteCollaborators'
> = ({navigation}) => {
  const {formatMessage: t} = useIntl();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleNameProject() {
    navigation.navigate('CreateProject');
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <AddPersonOrange width={86} height={80} />
        <HeaderText variant="header1" style={styles.title} numberOfLines={2}>
          {t(m.screenTitle)}
        </HeaderText>
      </View>

      <View style={styles.bodyContainer}>
        <BodyText variant="regular" style={styles.introText}>
          {t(m.introText)}
        </BodyText>
        <View style={styles.bulletList}>
          <InfoListItem text={t(m.readyToShare)} />
          <InfoListItem text={t(m.inviteOnly)} />
          <InfoListItem text={t(m.manageControl)} />
        </View>
      </View>

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
    </View>
  );
};

InviteCollaboratorsScreen.navTitle = m.screenTitle;

function InfoListItem({text}: {text: string}) {
  return (
    <View style={styles.bulletItem}>
      <MaterialIcons
        name="circle"
        size={4}
        color={NEW_DARK_GREY}
        style={styles.bulletIcon}
      />
      <BodyText variant="smallMeta" style={styles.bulletText}>
        {text}
      </BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    borderColor: BLUE_GREY,
    borderWidth: 1,
    padding: 20,
  },
  headerArea: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 30,
    paddingTop: 30,
    width: '60%',
    flexWrap: 'wrap',
  },
  title: {
    textAlign: 'center',
  },
  bodyContainer: {
    flex: 1,
    width: '70%',
    justifyContent: 'flex-start',
    gap: 20,
    alignSelf: 'center',
    paddingTop: 20,
  },
  introText: {
    lineHeight: 21,
  },
  bulletList: {
    flexDirection: 'column',
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 8,
  },
  bulletIcon: {
    marginTop: 6,
  },
  bulletText: {
    lineHeight: 18,
    flexShrink: 1,
  },
  buttonsContainer: {
    width: '100%',
    gap: 15,
    alignItems: 'center',
  },
});
