import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {DARK_ORANGE} from '../../lib/styles';
import ProjectParticipant from '../../images/ProjectParticipant.svg';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';

const m = defineMessages({
  title: {
    id: '$1screens.Settings.JoinAProject.title',
    defaultMessage: 'Join a Project',
  },
  heading: {
    id: '$1screens.Settings.JoinAProject.heading',
    defaultMessage: 'Coordinate with your team.',
  },
  description: {
    id: '$1screens.Settings.JoinAProject.description',
    defaultMessage:
      'Ask a project coordinator to receive a project invitation.',
  },
});

export const JoinAProject: NativeNavigationComponent<
  'JoinAProject' | 'JoinProjectIntro'
> = () => {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <IconTitleDescription
        icon={<ProjectParticipant width={80} height={60} color={DARK_ORANGE} />}
        title={t(m.heading)}
        description={t(m.description)}
      />
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
  },
});
