import {StyleSheet, View} from 'react-native';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {defineMessages, useIntl} from 'react-intl';
import {Button} from '../../../sharedComponents/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamsList} from '../../../sharedTypes/navigation';
import {DARK_GREY, NEW_DARK_GREY, BLUE_GREY} from '../../../lib/styles';

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
    defaultMessage: 'Go Back',
  },
});

export const JoinExistingProject = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'JoinExistingProject'>) => {
  const {formatMessage} = useIntl();
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.helpIconContainer}>
          <HeaderText variant="header1" style={styles.helpIconText}>
            ?
          </HeaderText>
        </View>

        <HeaderText variant="header1" style={styles.heading}>
          {formatMessage(m.howTo)}
        </HeaderText>

        <BodyText style={styles.instructions}>
          {formatMessage(m.instructions)}
        </BodyText>
      </View>

      <View style={styles.footer}>
        <Button
          fullWidth
          variant="outlined"
          style={{
            borderColor: BLUE_GREY,
          }}
          color="ComapeoBlue"
          onPress={() => {
            navigation.goBack();
          }}>
          {formatMessage(m.goBack)}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
  },
  topSection: {
    paddingTop: 80,
    alignItems: 'center',
    gap: 20,
  },
  helpIconContainer: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: NEW_DARK_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIconText: {
    color: NEW_DARK_GREY,
  },
  heading: {
    textAlign: 'center',
    color: DARK_GREY,
  },
  instructions: {
    textAlign: 'center',
    color: DARK_GREY,
    lineHeight: 24,
    paddingTop: 20,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 20,
    width: '100%',
  },
});
