import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import Warning from '../../images/Warning.svg';
import {Text} from '../../sharedComponents/Text';
import {defineMessages, useIntl} from 'react-intl';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {BLACK, DARK_BLUE, LIGHT_GREY} from '../../lib/styles';
import {ViewStyleProp} from '../../sharedTypes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const m = defineMessages({
  cantShare: {
    id: 'screens.ObservationsList.NoProjectWarning',
    defaultMessage: 'You are currently mapping on your own',
  },
  createOrJoin: {
    id: 'screens.ObservationsList.createOrJoin',
    defaultMessage: 'Create or Join a Project ',
    description:
      "The full sentence is 'Create or Join a Project to collect data with a team. This action will delete observations you have collected so far. Consider sharingimportant observations to you email before proceeding.' The sentence needs to be seperated for styling purposes",
  },
  toSync: {
    id: 'screens.ObservationsList.toSync',
    defaultMessage:
      'to collect data with a team. This action will delete observations you have collected so far. Consider sharing {icon} important observations to your email before proceeding.',
    description:
      "The full sentence is 'Create or Join a Project to collect data with a team. This action will delete observations you have collected so far. Consider sharing important observations to you email before proceeding.' The sentence needs to be seperated for styling purposes",
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
          style={{margin: 0, padding: 0}}
          onPress={() => navigate('CreateOrJoinProject')}>
          <Text style={{flexShrink: 1}}>
            <Text
              style={{
                textDecorationLine: 'underline',
                color: DARK_BLUE,
              }}>
              {formatMessage(m.createOrJoin)}
            </Text>
            {/* This space has to be added this way as it either effecting the underline styling (if added above) or effecting the rendering of the MaterialIcon if added below */}
            <Text> </Text>
            {formatMessage(m.toSync, {icon: <MaterialIcons name="share" />})}
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
