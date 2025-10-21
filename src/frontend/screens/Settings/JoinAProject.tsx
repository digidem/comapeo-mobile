import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {DARK_ORANGE} from '../../lib/styles';
import ProjectParticipant from '../../images/ProjectParticipant.svg';

const m = defineMessages({
  title: {
    id: 'screens.Settings.JoinAProject.title',
    defaultMessage: 'Join a Project',
  },
  heading: {
    id: 'screens.Settings.JoinAProject.heading',
    defaultMessage: 'Coordinate with your team.',
  },
  description: {
    id: 'screens.Settings.JoinAProject.description',
    defaultMessage:
      'Ask a project coordinator to receive a project invitation.',
  },
});

export const JoinAProject: NativeNavigationComponent<'JoinAProject'> = () => {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <ProjectParticipant width={80} height={60} color={DARK_ORANGE} />
      <HeaderText variant="header2" style={styles.heading}>
        {t(m.heading)}
      </HeaderText>
      <BodyText style={styles.description}>{t(m.description)}</BodyText>
    </View>
  );
};

JoinAProject.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  heading: {
    textAlign: 'center',
    paddingHorizontal: 50,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
