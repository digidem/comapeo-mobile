import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import ErrorIcon from '../images/Error.svg';
import {HeaderText} from './Text/HeaderText';
import {BodyText} from './Text/BodyText';
import {SecondaryButton} from './Buttons';

const m = defineMessages({
  goBack: {
    id: 'MapManagement.ErrorBottomSheet.goBack',
    defaultMessage: 'Go Back',
  },
});

export function MapShareError({
  title,
  description,
  onClose,
}: {
  title: string;
  description: string;
  onClose: () => void;
}) {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <ErrorIcon width={160} height={160} style={styles.icon} />
        <HeaderText style={styles.header}>{title}</HeaderText>
        <BodyText style={{textAlign: 'center'}}>{description}</BodyText>
      </View>
      <SecondaryButton
        style={{alignSelf: 'center'}}
        fullSize
        onPress={onClose}
        text={formatMessage(m.goBack)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginTop: 40,
    marginBottom: 30,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
});
