import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import GraphIcon from '../../images/Graph.svg';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';

const m = defineMessages({
  shareProjectStats: {
    id: 'screens.DeviceNaming.Success.shareProjectStats',
    defaultMessage: 'Share Project Statistics',
  },
  description: {
    id: 'screens.DeviceNaming.Success.description',
    defaultMessage:
      'This will help us gather data about how CoMapeo is being used and what additional features are needed.',
  },
});

export const ShareProjectStats = () => {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <GraphIcon />
        <HeaderText variant="header1" style={styles.text}>
          {formatMessage(m.shareProjectStats)}
        </HeaderText>
        <BodyText style={{marginTop: 20}}>
          {formatMessage(m.description)}{' '}
        </BodyText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  text: {
    marginTop: 20,
  },
});
