import * as React from 'react';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {StyleSheet, View} from 'react-native';
import {BottomSheetWrapper} from '../../../sharedComponents/BottomSheetWrapper';
import ErrorIcon from '../../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {Button} from '../../../sharedComponents/Button';
import {BodyText} from '../../../sharedComponents/Text/BodyText';

const m = defineMessages({
  goBack: {
    id: 'MapManagement.ErrorBottomSheet.goBack',
    defaultMessage: 'Go Back',
  },
});

export const BackgroundMapErrorBottomSheet = ({
  navigation,
  route,
}: NativeRootNavigationProps<'BackgroundMapErrorBottomSheet'>) => {
  const {formatMessage} = useIntl();
  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <ErrorIcon width={160} height={160} style={styles.icon} />
          <HeaderText style={styles.header}>{route.params.title}</HeaderText>
          <BodyText style={{textAlign: 'center'}}>
            {route.params.description}
          </BodyText>
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
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
});
