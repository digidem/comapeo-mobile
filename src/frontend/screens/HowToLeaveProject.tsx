import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../sharedComponents/Text';
import {defineMessages, useIntl} from 'react-intl';
import {Button} from '../sharedComponents/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamsList} from '../sharedTypes/navigation';
import {LIGHT_GREY} from '../lib/styles';
import Warning from '../images/Warning.svg';
import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {useProjectMembers} from '../hooks/server/projects';
import {useDeviceInfo} from '../hooks/server/deviceInfo';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../sharedTypes';
import {UIActivityIndicator} from 'react-native-indicators';
import {QuestionMarkWithShadow} from '../sharedComponents/icons/QuestionMarkWithShadow';

const m = defineMessages({
  howTo: {
    id: 'screens.HowToLeaveProject.howTo',
    defaultMessage: 'How to Leave Project',
  },
  instructions: {
    id: 'screens.HowToLeaveProject.instructions',
    defaultMessage:
      'To leave this project please uninstall and reinstall CoMapeo. All project data will be removed from this device.',
  },
  goBack: {
    id: 'screens.HowToLeaveProject.goBack',
    defaultMessage: 'Go back',
  },
  warning: {
    id: 'screens.HowToLeaveProject.warning',
    defaultMessage:
      'If you are the only Coordinator on the project no one else will be able to edit project details or invite other devices!',
  },
});

export const HowToLeaveProject = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'HowToLeaveProject'>) => {
  const {formatMessage} = useIntl();
  const membersQuery = useProjectMembers();
  const deviceInfo = useDeviceInfo();

  const coordinators = !membersQuery.data
    ? []
    : membersQuery.data.filter(
        member =>
          member.role.roleId === COORDINATOR_ROLE_ID ||
          member.role.roleId === CREATOR_ROLE_ID,
      );

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.container}
      dockContent={
        <Button
          fullWidth
          variant="outlined"
          onPress={() => {
            navigation.goBack();
          }}>
          {formatMessage(m.goBack)}
        </Button>
      }>
      <QuestionMarkWithShadow style={{marginBottom: 20}} />
      <Text style={[styles.text, {fontSize: 32, fontWeight: 'bold'}]}>
        {formatMessage(m.howTo)}
      </Text>
      <Text style={[styles.text, {marginTop: 20}]}>
        {formatMessage(m.instructions)}
      </Text>

      {membersQuery.isPending || deviceInfo.isPending ? (
        <UIActivityIndicator style={{marginTop: 20}} />
      ) : coordinators.some(
          coordinator => coordinator.deviceId === deviceInfo.data?.deviceId,
        ) ? (
        <View style={[styles.greyBox, {marginTop: 20}]}>
          <Warning style={{marginRight: 20}} />
          <Text style={{flex: 1}}>{formatMessage(m.warning)}</Text>
        </View>
      ) : null}
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  greyBox: {
    backgroundColor: LIGHT_GREY,
    padding: 20,
    borderRadius: 6,
    borderStyle: 'dashed',
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionIcon: {
    shadowColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 100,
    elevation: 20,
    marginBottom: 20,
  },
});
