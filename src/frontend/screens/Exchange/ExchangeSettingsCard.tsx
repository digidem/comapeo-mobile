import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {Button} from '../../sharedComponents/Button';
import {COMAPEO_BLUE, NEW_DARK_GREY, BLACK} from '../../lib/styles';

type Props = {
  title: string;
  mediaDescription: string;
  storageDescription: string;
  showChangeSettingsLink: boolean;
  onPressChangeSettings: () => void;
};

export const ExchangeSettingsCard = ({
  title,
  mediaDescription,
  storageDescription,
  showChangeSettingsLink,
  onPressChangeSettings,
}: Props) => {
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
            Change Settings
          </HeaderText>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    alignItems: 'center',
  },
  changeLink: {
    color: COMAPEO_BLUE,
    marginTop: 12,
  },
});
