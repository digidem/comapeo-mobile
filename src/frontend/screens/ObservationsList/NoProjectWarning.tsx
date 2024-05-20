import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import Warning from '../../images/Warning.svg';
import {Text} from '../../sharedComponents/Text';
import {defineMessages, useIntl} from 'react-intl';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {BLACK, DARK_BLUE, LIGHT_GREY} from '../../lib/styles';
import {ViewStyleProp} from '../../sharedTypes';

const m = defineMessages({
  cantShare: {
    id: 'screens.ObservationsList.NoProjectWarning',
    defaultMessage: 'You won’t be able to share observations collected yet.',
  },
  createOrJoin: {
    id: 'screens.ObservationsList.createOrJoin',
    defaultMessage: 'Create or Join a Project.',
    description:
      "The full sentence is 'To sync and share with other devices, Create or Join a Project.' The sentence needs to be seperated for styling purposes",
  },
  toSync: {
    id: 'screens.ObservationsList.toSync',
    defaultMessage: 'To sync and share with other devices,',
    description:
      "The full sentence is 'To sync and share with other devices, Create or Join a Project.' The sentence needs to be seperated for styling purposes",
  },
});

export const NoProjectWarning = ({style}: {style?: ViewStyleProp}) => {
  const {formatMessage} = useIntl();
  const {navigate} = useNavigationFromRoot();
  return (
    <View style={[styles.container, style]}>
      <Warning style={{marginRight: 10}} />
      <View style={{flex: 1}}>
        <Text style={{flexShrink: 1}}>{formatMessage(m.cantShare)}</Text>
        <TouchableOpacity
          style={{flexDirection: 'row', marginTop: 10}}
          onPress={() => navigate('CreateOrJoinProject')}>
          <Text style={{flexShrink: 1}}>
            {formatMessage(m.toSync) + ' '}
            <Text
              style={{
                textDecorationLine: 'underline',
                color: DARK_BLUE,
              }}>
              {formatMessage(m.createOrJoin)}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: LIGHT_GREY,
    padding: 20,
    borderRadius: 5,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: BLACK,
  },
});
