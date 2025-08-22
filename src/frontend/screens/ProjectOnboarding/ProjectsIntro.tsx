import * as React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProjectOnboardingParamsList} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {NEW_DARK_GREY, BLUE_GREY, DARK_GREY} from '../../lib/styles';
import ExistingProjectIcon from '../../images/AddPerson.svg';
import IntroProjectIcon from '../../images/NoProjectOrange.svg';
import NewProjectIcon from '../../images/AddSquare.svg';
import MapSoloIcon from '../../images/NoProjectIcon.svg';
import ChevronRightIcon from '../../images/ChevronRight.svg';
import {ScrollView} from 'react-native-gesture-handler';

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerArea}>
        <IntroProjectIcon width={80} height={80} />
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
          icon={
            <ExistingProjectIcon width={20} height={20} color={NEW_DARK_GREY} />
          }
          text={t(m.joinExisting)}
          onPress={() => navigation.navigate('JoinProject')}
        />
        <Row
          icon={<NewProjectIcon width={20} height={20} color={NEW_DARK_GREY} />}
          text={t(m.startNew)}
          onPress={() => navigation.navigate('StartNewProject')}
        />
        <Row
          icon={<MapSoloIcon width={20} height={20} />}
          text={t(m.mapSolo)}
          onPress={() => navigation.navigate('MapOnOwn')}
        />
      </View>
    </ScrollView>
  );
};

function Row({
  icon,
  text,
  onPress,
}: {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <View style={styles.rowLeft}>
        {icon}
        <HeaderText variant="header5">{text}</HeaderText>
      </View>
      <ChevronRightIcon width={20} height={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: 'center',
    gap: 15,
    paddingBottom: 20,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  infoText: {
    textAlign: 'center',
  },
  subInfoText: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
  },
  actions: {
    gap: 15,
    paddingHorizontal: 20,
  },
  row: {
    borderColor: BLUE_GREY,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 21,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
