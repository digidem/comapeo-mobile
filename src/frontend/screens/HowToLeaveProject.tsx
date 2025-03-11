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
import {useOwnDeviceInfo, useManyMembers} from '@comapeo/core-react';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../sharedTypes';
import {QuestionMarkWithShadow} from '../sharedComponents/icons/QuestionMarkWithShadow';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {Loading} from '../sharedComponents/Loading';

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

export const HowToLeaveProjectContent = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'HowToLeaveProject'>) => {
  const {formatMessage} = useIntl();
  const {projectId} = useActiveProject();
  const {data: members} = useManyMembers({projectId});
  const {data: deviceInfo} = useOwnDeviceInfo();

  const coordinators = !members
    ? []
    : members.filter(
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

      {coordinators.some(
        coordinator => coordinator.deviceId === deviceInfo.deviceId,
      ) && (
        <View style={[styles.greyBox, {marginTop: 20}]}>
          <Warning style={{marginRight: 20}} />
          <Text style={{flex: 1}}>{formatMessage(m.warning)}</Text>
        </View>
      )}
    </ScreenContentWithDock>
  );
};

export const HowToLeaveProject = (
  props: NativeStackScreenProps<AppStackParamsList, 'HowToLeaveProject'>,
) => (
  <React.Suspense fallback={<Loading />}>
    <HowToLeaveProjectContent {...props} />
  </React.Suspense>
);

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
});
