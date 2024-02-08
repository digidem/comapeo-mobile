import {StyleSheet, View} from 'react-native';
import {Text} from '../../../sharedComponents/Text';
import {defineMessages, useIntl} from 'react-intl';
import {Button} from '../../../sharedComponents/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackList} from '../../../Navigation/AppStack';

const m = defineMessages({
  howTo: {
    id: 'screens.Settings.CreateOrJoinProject.JoinExistingProject.howTo',
    defaultMessage: 'How to Join a Project',
  },
  instructions: {
    id: 'screens.Settings.CreateOrJoinProject.JoinExistingProject.instructions',
    defaultMessage:
      'To join a project find a Coordinator of the project you wish to join. Tell them your device name and the Coordinator will send you an invite.',
  },
  goBack: {
    id: 'screens.Settings.CreateOrJoinProject.JoinExistingProject.goBack',
    defaultMessage: 'Go back',
  },
});

export const JoinExistingProject = ({
  navigation,
}: NativeStackScreenProps<AppStackList, 'JoinExistingProject'>) => {
  const {formatMessage} = useIntl();
  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.text, {fontSize: 20}]}>
          {formatMessage(m.howTo)}
        </Text>
        <Text style={[styles.text, {marginTop: 20}]}>
          {formatMessage(m.instructions)}
        </Text>
      </View>
      <Button
        fullWidth
        variant="outlined"
        onPress={() => {
          navigation.goBack();
        }}>
        {formatMessage(m.goBack)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    justifyContent: 'space-between',
    height: '100%',
  },
  text: {
    textAlign: 'center',
  },
});
