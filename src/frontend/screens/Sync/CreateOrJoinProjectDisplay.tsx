import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {Button} from '../../sharedComponents/Button';
import {Text} from '../../sharedComponents/Text';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {WHITE} from '../../lib/styles';

const m = defineMessages({
  description: {
    id: 'screens.Sync.CreateOrJoinProjectDisplay.description',
    defaultMessage: 'Create or Join a Project to sync with other devices',
  },
  buttonText: {
    id: 'screens.Sync.CreateOrJoinProjectDisplay.buttonText',
    defaultMessage: 'Create or Join Project',
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
          fullWidth
          onPress={onCreateOrJoinProject}
          testID="PROJECT.create-join-btn">
          <Text style={styles.buttonText}>{t(m.buttonText)}</Text>
        </Button>
      }>
      <View style={styles.contentContainer}>
        <Text style={styles.descriptionText}>{t(m.description)}</Text>
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
