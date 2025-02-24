import * as React from 'react';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import ErrorIcon from '../../images/Error.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {Button} from '../../sharedComponents/Button';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {RED} from '../../lib/styles';

const m = defineMessages({
  title: {
    id: 'screens.DeleteAudioBottomSheet.Title',
    defaultMessage: 'Delete?',
  },
  description: {
    id: 'screens.DeleteAudioBottomSheet.Description',
    defaultMessage:
      'Your Audio Recording will be permanently deleted. This cannot be undone.',
  },
  delete: {
    id: 'screens.DeleteAudioBottomSheet.delete',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'screens.DeleteAudioBottomSheet.cancel',
    defaultMessage: 'Cancel',
  },
});

export const DeleteAudioBottomSheet = ({
  navigation,
  route,
}: NativeRootNavigationProps<'DeleteAudioBottomSheet'>) => {
  const {formatMessage} = useIntl();
  const {goBack} = navigation;

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <ErrorIcon />
          <HeaderText
            variant="header2"
            style={{marginTop: 20, textAlign: 'center'}}>
            {formatMessage(m.title)}
          </HeaderText>
          <BodyText style={{marginTop: 10, textAlign: 'center'}}>
            {formatMessage(m.description)}
          </BodyText>
        </View>
        <View style={{width: '100%'}}>
          <Button
            fullWidth
            color="dark"
            style={{backgroundColor: RED, marginTop: 30}}
            onPress={route.params.onPressDelete}>
            {formatMessage(m.delete)}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onPress={goBack}
            style={{marginTop: 20}}>
            {formatMessage(m.cancel)}
          </Button>
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
