import {StyleSheet, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from './Text';
import {BLACK} from '../lib/styles';
import {ViewStyleProp} from '../sharedTypes';

const m = defineMessages({
  coordinator: {
    id: 'sharedComponents.RoleWithIcon.coordinator',
    defaultMessage: 'Coordinator',
  },
  particpant: {
    id: 'sharedComponents.RoleWithIcon.particpant',
    defaultMessage: 'Particpant',
  },
});

type RoleWithIconProps = {
  role: 'particpant' | 'coordinator';
  style?: ViewStyleProp;
};

export const RoleWithIcon = ({role, style}: RoleWithIconProps) => {
  const {formatMessage} = useIntl();
  return (
    <View style={[styles.flexRow, style]}>
      {role === 'particpant' ? (
        <MaterialIcon name={'people'} size={25} color={BLACK} />
      ) : (
        <MaterialCommunity name="account-cog" size={25} color={BLACK} />
      )}
      <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
        {formatMessage(role === 'coordinator' ? m.coordinator : m.particpant)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
