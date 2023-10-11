import {ScrollView} from 'react-native';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '../../../sharedComponents/List';
import {FormattedMessage, defineMessages} from 'react-intl';
import {NativeNavigationComponent} from '../../../sharedTypes';

const m = defineMessages({
  title: {
    id: 'Screens.Settings.AppSettings.title',
    defaultMessage: 'App Setttings',
  },
  language: {
    id: 'Screens.Settings.AppSettings.language',
    defaultMessage: 'Language',
  },
  languageDesc: {
    id: 'Screens.Settings.AppSettings.languageDesc',
    defaultMessage: 'Display language for app',
  },
});

export const AppSettings: NativeNavigationComponent<'AppSettings'> = () => {
  return (
    <ScrollView>
      <List>
        <ListItem onPress={() => {}}>
          <ListItemIcon iconName="language" />
          <ListItemText
            primary={<FormattedMessage {...m.language} />}
            secondary={<FormattedMessage {...m.languageDesc} />}></ListItemText>
        </ListItem>
      </List>
    </ScrollView>
  );
};

AppSettings.navTitle = m.title;
