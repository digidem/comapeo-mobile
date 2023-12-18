import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeNavigationComponent} from '../../../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../sharedComponents/Text';
import {useDeviceInfo} from '../../../hooks/server/deviceInfo';
import {Loading} from '../../../sharedComponents/Loading';
import {HeaderRightEditButton} from '../../../sharedComponents/HeaderRightEditButton';

const m = defineMessages({
  title: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.title',
    defaultMessage: 'Device Name',
  },
  yourDevice: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.yourDevice',
    defaultMessage: 'Your Device Name',
  },
});

export const DeviceName: NativeNavigationComponent<'DeviceName'> = ({
  navigation,
}) => {
  const deviceInfo = useDeviceInfo();

  const {formatMessage: t} = useIntl();

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightEditButton
          onPress={() => navigation.navigate('DeviceNameEdit')}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold', marginBottom: 10}}>
        {t(m.yourDevice)}
      </Text>
      {deviceInfo.isSuccess ? (
        <Text>{deviceInfo.data?.name}</Text>
      ) : (
        <Loading />
      )}
    </View>
  );
};

DeviceName.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
});
