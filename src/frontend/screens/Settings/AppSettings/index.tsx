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
  coordinateSystem: {
    id: 'Screens.Settings.AppSettings.coordinateSystem',
    defaultMessage: 'Coordinate System',
  },
  coordinateSystemDesc: {
    id: 'Screens.Settings.AppSettings.coordinateSystemDesc',
    defaultMessage: 'UTM,Lat/Lon,DMS',
  },
});

export const AppSettings: NativeNavigationComponent<'AppSettings'> = ({
  navigation,
}) => {
  return (
    <ScrollView>
      <List>
        <ListItem onPress={() => {}}>
          <ListItemIcon iconName="language" />
          <ListItemText
            primary={<FormattedMessage {...m.language} />}
            secondary={<FormattedMessage {...m.languageDesc} />}></ListItemText>
        </ListItem>
        <ListItem
          onPress={() => navigation.navigate('CoordinateFormat')}
          testID="settingsCoodinatesButton">
          <ListItemIcon iconName="explore" />
          <ListItemText
            primary={<FormattedMessage {...m.coordinateSystem} />}
            secondary={
              <FormattedMessage {...m.coordinateSystemDesc} />
            }></ListItemText>
        </ListItem>
      </List>
    </ScrollView>
  );
};

AppSettings.navTitle = m.title;
