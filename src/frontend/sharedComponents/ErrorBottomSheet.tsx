import * as React from 'react';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {StyleSheet, View} from 'react-native';
import {BottomSheetWrapper} from './BottomSheetWrapper';
import ErrorIcon from '../images/Error.svg';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {HeaderText} from './Text/HeaderText';
import {ScreenContentWithDock} from './ScreenContentWithDock';
import {Button} from './Button';

const m = defineMessages({
  somethingWrong: {
    id: 'sharedComponents.ErrorBottomSheet.somethingWrong',
    defaultMessage: 'Something\n Went Wrong',
  },
  goBack: {
    id: 'sharedComponents.ErrorBottomSheet.goBack',
    defaultMessage: 'Go Back',
  },
});

export const ErrorBottomSheet = ({
  navigation,
}: NativeRootNavigationProps<'ErrorBottomSheet'>) => {
  const {formatMessage} = useIntl();
  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <ErrorIcon width={160} height={160} style={styles.icon} />
          <HeaderText style={{textAlign: 'center'}}>
            {formatMessage(m.somethingWrong)}
          </HeaderText>
        </View>
        <Button
          variant="outlined"
          fullWidth
          onPress={() => navigation.goBack()}>
          {formatMessage(m.goBack)}
        </Button>
      </View>
    </BottomSheetWrapper>
  );
};

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
});
