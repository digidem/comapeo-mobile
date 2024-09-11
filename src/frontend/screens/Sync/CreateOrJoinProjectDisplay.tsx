import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Button} from '../../sharedComponents/Button';
import {Text} from '../../sharedComponents/Text';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {WHITE} from '../../lib/styles';

const m = defineMessages({
  title: {
    id: 'screens.Sync.CreateOrJoinProjectDisplay.title',
    defaultMessage: 'Create or join a project to collect data with a team',
  },
  buttonText: {
    id: 'screens.Sync.CreateOrJoinProjectDisplay.buttonText',
    defaultMessage: 'Create or Join Project',
  },
  subTitle: {
    id: 'screens.Sync.CreateOrJoinProjectDisplay.subTitle',
    defaultMessage:
      'You will be able to share data with devices that are part of the same project.',
  },
  subText: {
    id: 'screens.Sync.CreateOrJoinProjectDisplay.subText',
    defaultMessage:
      'This action will delete observations you have collected so far. Consider sharing {icon} important observations to you email before proceeding.',
  },
});

export const CreateOrJoinProjectDisplay = ({
  onCreateOrJoinProject,
}: {
  onCreateOrJoinProject: () => void;
}) => {
  const {formatMessage: t} = useIntl();

  return (
    <ScreenContentWithDock
      dockContent={
        <Button
          testID="PROJECT.create-join-btn"
          fullWidth
          onPress={onCreateOrJoinProject}>
          <Text style={styles.buttonText}>{t(m.buttonText)}</Text>
        </Button>
      }>
      <View style={styles.contentContainer}>
        <Text style={styles.descriptionText}>{t(m.title)}</Text>
        <Text>{t(m.subTitle)}</Text>
        <Text>
          {t(m.subText, {icon: () => <MaterialIcons name="share" />})}
        </Text>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentContainer: {paddingTop: 40},
  descriptionText: {
    textAlign: 'center',
    fontSize: 40,
  },
  buttonText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
