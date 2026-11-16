import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {Button} from '../../sharedComponents/Button';
import {COMAPEO_BLUE, NEW_DARK_GREY, BLACK} from '../../lib/styles';
import {defineMessages, useIntl} from 'react-intl';

type Props = {
  title: string;
  mediaDescription: string;
  storageDescription: string;
  showChangeSettingsLink: boolean;
  onPressChangeSettings: () => void;
};

const m = defineMessages({
  changeSettings: {
    id: 'screens.ExchangeSettingsCard.changeSettings',
    defaultMessage: 'Change Settings',
  },
});

export const ExchangeSettingsCard = ({
  title,
  mediaDescription,
  storageDescription,
  showChangeSettingsLink,
  onPressChangeSettings,
}: Props) => {
  const {formatMessage: t} = useIntl();
  return (
    <View style={styles.container}>
      <HeaderText variant="header6" style={{color: BLACK}}>
        {title}
      </HeaderText>
      <BodyText variant="smallMeta" style={{color: NEW_DARK_GREY}}>
        {mediaDescription}
      </BodyText>
      <BodyText variant="smallMeta" style={{color: NEW_DARK_GREY}}>
        {storageDescription}
      </BodyText>
      {showChangeSettingsLink && (
        <Button variant="text" onPress={onPressChangeSettings}>
          <HeaderText variant="header6" style={styles.changeLink}>
            {t(m.changeSettings)}
          </HeaderText>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  changeLink: {
    color: COMAPEO_BLUE,
    marginTop: 12,
  },
});
