import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import AddPersonIcon from '../../images/AddPerson.svg';

import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {DARK_ORANGE} from '../../lib/styles';

const m = defineMessages({
  screenTitle: {
    id: 'ProjectOnboarding.JoinProject.title',
    defaultMessage: 'Join a Project',
  },
  bodyText: {
    id: 'ProjectOnboarding.JoinProject.bodyText',
    defaultMessage:
      'Ask a Project Coordinator for an invitation to their Project.',
  },
  goBackButton: {
    id: 'ProjectOnboarding.JoinProject.goBackButton',
    defaultMessage: 'Go Back',
  },
});

type Props = NativeRootNavigationProps<'JoinProject'>;

export const JoinProject: React.FC<Props> = ({navigation}) => {
  const {formatMessage: t} = useIntl();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <ScreenContentWithDock
      dockContent={
        <SecondaryButton
          fullSize={true}
          text={t(m.goBackButton)}
          onPress={handleGoBack}
        />
      }>
      <View style={styles.contentArea}>
        <AddPersonIcon color={DARK_ORANGE} width={80} height={80} />
        <HeaderText style={styles.title}>{t(m.screenTitle)}</HeaderText>
        <BodyText style={styles.bodyText}>{t(m.bodyText)}</BodyText>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentArea: {
    alignItems: 'center',
    gap: 35,
    paddingTop: 40,
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bodyText: {
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 21,
  },
});
