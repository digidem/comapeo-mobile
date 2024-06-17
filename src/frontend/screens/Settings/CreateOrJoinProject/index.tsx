import * as React from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../sharedComponents/Text';
import {NativeNavigationComponent, ViewStyleProp} from '../../../sharedTypes';
import {ScrollView, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {LIGHT_GREY} from '../../../lib/styles';
import Warning from '../../../images/Warning.svg';
import {useAllProjects} from '../../../hooks/server/projects';
import {CenteredView} from '../../../sharedComponents/CenteredView';
import {Loading} from '../../../sharedComponents/Loading';

const m = defineMessages({
  title: {
    id: 'screens.Settings.CreateOrJoinProject.title',
    defaultMessage: 'Create or Join',
  },
  createProject: {
    id: 'screens.Settings.CreateOrJoinProject.createProject',
    defaultMessage: 'Create a Project',
  },
  startProject: {
    id: 'screens.Settings.CreateOrJoinProject.startProject',
    defaultMessage: 'Start a CoMapeo Project',
  },
  joinProject: {
    id: 'screens.Settings.CreateOrJoinProject.joinProject',
    defaultMessage: 'Join a Project',
  },
  joinExisting: {
    id: 'screens.Settings.CreateOrJoinProject.joinExisting',
    defaultMessage: 'Join an existing Mapeo Project',
  },
  whatIsAProject: {
    id: 'screens.Settings.CreateOrJoinProject.whatIsAProject',
    defaultMessage: 'What is a Project',
  },
  projectDescription: {
    id: 'screens.Settings.CreateOrJoinProject.projectDescription',
    defaultMessage:
      'A project is a secure container for your data. Only devices you invite can enter and share data with you. Create or Join a project in order to share data with other devices.',
  },
  alreadyOnProject: {
    id: 'screens.Settings.CreateOrJoinProject.alreadyOnProject',
    defaultMessage:
      'You are already on a project. To create a new Project you must uninstall and reininstall CoMapeo.',
  },
});

export const CreateOrJoinProject: NativeNavigationComponent<
  'CreateOrJoinProject'
> = ({navigation}) => {
  const {formatMessage: t} = useIntl();
  const projects = useAllProjects();

  if (projects.data) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.greyBox}>
          <Text style={{fontWeight: 'bold'}}>{t(m.whatIsAProject)}</Text>
          <Text>{t(m.projectDescription)}</Text>
        </View>
        {projects.data.length > 1 ? (
          <View style={[styles.greyBox, {marginTop: 10}]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Warning style={{marginRight: 20}} />
              <View style={{flex: 1}}>
                <Text style={{fontWeight: 'bold'}}>{t(m.createProject)}</Text>
                <Text style={{}}>{t(m.alreadyOnProject)}</Text>
              </View>
            </View>
          </View>
        ) : (
          <CardButton
            header={m.createProject}
            subHeader={m.startProject}
            style={{marginTop: 10}}
            isLoading={projects.isLoading}
            onPress={() => {
              navigation.navigate('CreateProject');
            }}
            testID="PROJECT.create-card"
          />
        )}
        <CardButton
          header={m.joinProject}
          subHeader={m.joinExisting}
          style={{marginTop: 10}}
          onPress={() => {
            navigation.navigate('JoinExistingProject');
          }}
        />
      </ScrollView>
    );
  }

  return (
    <CenteredView>
      <Loading />
    </CenteredView>
  );
};

CreateOrJoinProject.navTitle = m.title;

type CardButtonProps = {
  header: MessageDescriptor;
  subHeader: MessageDescriptor;
  style?: ViewStyleProp;
  isLoading?: boolean;
  onPress: () => void;
  testID?: string;
};

function CardButton({
  header,
  subHeader,
  style,
  onPress,
  testID,
}: CardButtonProps) {
  const {formatMessage: t} = useIntl();
  return (
    <TouchableOpacity
      style={[styles.cardButton, style]}
      onPress={onPress}
      accessibilityLabel={testID}>
      <React.Fragment>
        <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>
          {t(header)}
        </Text>
        <Text style={{fontSize: 16, marginTop: 10, textAlign: 'center'}}>
          {t(subHeader)}
        </Text>
      </React.Fragment>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  cardButton: {
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 3,
  },
  greyBox: {
    backgroundColor: LIGHT_GREY,
    padding: 20,
    borderRadius: 6,
    borderStyle: 'dashed',
    borderColor: LIGHT_GREY,
    borderWidth: 1,
  },
});
