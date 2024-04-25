import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {WHITE} from '../../lib/styles';
import {Text} from '../../sharedComponents/Text';
import {Button} from '../../sharedComponents/Button';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';

const m = defineMessages({
  title: {
    id: 'screens.Sync.NoWifiDisplay.title',
    defaultMessage: 'No WiFi',
  },
  description: {
    id: 'screens.Sync.NoWifiDisplay.description',
    defaultMessage:
      'Open your phone settings and connect to a WiFi network to synchronize',
  },
  buttonText: {
    id: 'screens.Sync.NoWifiDisplay.buttonText',
    defaultMessage: 'Open Settings',
  },
});

export const NoWifiDisplay = ({
  onOpenSettings,
}: {
  onOpenSettings: () => void;
}) => {
  const {formatMessage: t} = useIntl();

  return (
    <ScreenContentWithDock
      dockContent={
        <Button fullWidth onPress={onOpenSettings}>
          <Text style={styles.buttonText}>{t(m.buttonText)}</Text>
        </Button>
      }>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{t(m.title)}</Text>
        <Text style={styles.descriptionText}>{t(m.description)}</Text>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 40,
    rowGap: 12,
  },
  titleText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 24,
    textAlign: 'center',
  },
  buttonText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
