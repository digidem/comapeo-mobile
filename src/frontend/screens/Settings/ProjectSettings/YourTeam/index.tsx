import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {
  NativeNavigationComponent,
  ViewStyleProp,
} from '../../../../sharedTypes';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button} from '../../../../sharedComponents/Button';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Text} from '../../../../sharedComponents/Text';
import {BLACK} from '../../../../lib/styles';
import {DeviceCard} from '../../../../sharedComponents/DeviceCard';

const m = defineMessages({
  title: {
    id: 'screens.Setting.ProjectSettings.YourTeam.title',
    defaultMessage: 'Your Team',
  },
  inviteDevice: {
    id: 'screens.Setting.ProjectSettings.YourTeam.inviteDevice',
    defaultMessage: 'Invite Device',
  },
  coordinators: {
    id: 'screens.Setting.ProjectSettings.YourTeam.coordinators',
    defaultMessage: 'Coordinators',
  },
  particpants: {
    id: 'screens.Setting.ProjectSettings.YourTeam.particpants',
    defaultMessage: 'Particpants',
  },
  coordinatorDescription: {
    id: 'screens.Setting.ProjectSettings.YourTeam.coordinatorDescription',
    defaultMessage:
      'Coordinators can invite devices, edit and delete data, and manage project details.',
  },
  deviceName: {
    id: 'screens.Setting.ProjectSettings.YourTeam.deviceName',
    defaultMessage: 'Device Name',
  },
  dateAdded: {
    id: 'screens.Setting.ProjectSettings.YourTeam.dateAdded',
    defaultMessage: 'Date Added',
  },
  particpantDescription: {
    id: 'screens.Setting.ProjectSettings.YourTeam.particpantDescription',
    defaultMessage:
      'Participants can take and share observations. They cannot manage users or project details.',
  },
});

export const YourTeam: NativeNavigationComponent<'YourTeam'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();

  return (
    <ScrollView style={styles.container}>
      <Button
        fullWidth
        variant="outlined"
        onPress={() => {
          navigation.navigate('SelectDevice');
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialIcon
            color={BLACK}
            size={32}
            name="person-add"
            style={{marginRight: 10}}
          />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            {t(m.inviteDevice)}
          </Text>
        </View>
      </Button>
      <IconHeader
        iconName="manage-accounts"
        messageDescriptor={m.coordinators}
        style={{marginTop: 20}}
      />
      <Text style={{marginTop: 10}}>{t(m.coordinatorDescription)}</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text style={{marginTop: 10}}>{t(m.deviceName)}</Text>
        <Text style={{marginTop: 10}}>{t(m.dateAdded)}</Text>
      </View>

      <DeviceCard
        style={{marginTop: 10}}
        name="sofia"
        deviceId="Andki 1635"
        deviceType="mobile"
        thisDevice={true}
      />

      <IconHeader
        iconName="people"
        messageDescriptor={m.particpants}
        style={{marginTop: 20}}
      />
      <Text style={{marginTop: 10}}>{t(m.particpantDescription)}</Text>
    </ScrollView>
  );
};

YourTeam.navTitle = m.title;

const IconHeader = ({
  iconName,
  messageDescriptor,
  style,
}: {
  iconName: string;
  messageDescriptor: MessageDescriptor;
  style?: ViewStyleProp;
}) => {
  const {formatMessage: t} = useIntl();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
        style,
      ]}>
      <MaterialIcon
        color={BLACK}
        size={32}
        name={iconName}
        style={{marginRight: 10}}
      />
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
        {t(messageDescriptor)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
});
