import {Text, View} from 'react-native';
import {NativeNavigationComponent} from '../../sharedTypes';
import {defineMessages} from 'react-intl';

const m = defineMessages({
  navTitle: {
    id: 'screens.Settings.EmptySettingsScreen.navTitle',
    defaultMessage: 'Empty screen',
    description: 'Temporary empty screen',
  },
});

export const EmptySettingsScreen: NativeNavigationComponent<'Empty'> = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>[PLACEHOLDER]</Text>
  </View>
);

EmptySettingsScreen.navTitle = m.navTitle;
