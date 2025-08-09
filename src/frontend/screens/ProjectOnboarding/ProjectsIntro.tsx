import * as React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProjectOnboardingParamsList} from '../../sharedTypes/navigation';
import CoMapeoShield from '../../images/CoMapeoShield.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {NEW_DARK_GREY, BLUE_GREY, DARK_GREY, WHITE} from '../../lib/styles';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import NoProjectIcon from '../../images/NoProjectIcon.svg';

const m = defineMessages({
  title: {
    id: 'screens.ProjectsIntro.title',
    defaultMessage: 'Secure & Private Collaborations',
  },
  intro: {
    id: 'screens.ProjectsIntro.intro',
    defaultMessage:
      'CoMapeo helps teams securely store territory mapping observations.',
  },
  sharingNote: {
    id: 'screens.ProjectsIntro.sharingNote',
    defaultMessage:
      'Observations can only be shared with other devices on the same project.',
  },
  joinExisting: {
    id: 'screens.ProjectsIntro.joinExisting',
    defaultMessage: 'Join an Existing Project',
  },
  startNew: {
    id: 'screens.ProjectsIntro.startNew',
    defaultMessage: 'Start a New Project',
  },
  mapSolo: {id: 'screens.ProjectsIntro.mapSolo', defaultMessage: 'Go to Map'},
});

export const ProjectsIntro = ({
  navigation,
}: NativeStackScreenProps<ProjectOnboardingParamsList, 'ProjectsIntro'>) => {
  const {formatMessage: t} = useIntl();

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.container}
      dockContent={<View />}
      dockContainerStyle={{paddingVertical: 0}}>
      <View style={styles.headerArea}>
        <CoMapeoShield width={80} height={80} />
        <HeaderText variant="header1" style={styles.title} numberOfLines={2}>
          {t(m.title)}
        </HeaderText>
      </View>

      <View style={styles.infoCard}>
        <BodyText style={styles.infoText}>{t(m.intro)}</BodyText>
        <BodyText variant="smallMeta" style={styles.subInfoText}>
          {t(m.sharingNote)}
        </BodyText>
      </View>

      <View style={styles.actions}>
        <Row
          text={t(m.joinExisting)}
          onPress={() => navigation.navigate('JoinExistingProject')}
        />
        <Row
          text={t(m.startNew)}
          onPress={() => navigation.navigate('CreateProject')}
        />
        <Row
          text={t(m.mapSolo)}
          onPress={() => navigation.navigate('Home', {screen: 'Map'})}
        />
      </View>
    </ScreenContentWithDock>
  );
};

function Row({text, onPress}: {text: string; onPress: () => void}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <HeaderText variant="header5">{text}</HeaderText>
      <BodyText style={{color: NEW_DARK_GREY}}>{'>'}</BodyText>
      <View style={{width: 10, height: 16}} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    gap: 15,
    backgroundColor: WHITE,
    borderColor: BLUE_GREY,
    borderWidth: 1,
  },
  headerArea: {
    alignItems: 'center',
    gap: 30,
  },
  title: {
    textAlign: 'center',
    color: DARK_GREY,
  },
  infoCard: {
    alignItems: 'center',
    padding: 20,
    gap: 12,
    width: 320,
    borderRadius: 10,
  },
  infoText: {
    textAlign: 'center',
  },
  subInfoText: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
  },
  actions: {
    width: 300,
    gap: 12,
  },
  row: {
    minHeight: 64,
    borderColor: BLUE_GREY,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
