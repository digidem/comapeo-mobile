import {View} from 'react-native';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {DestructiveButton, SecondaryButton} from '../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';

const m = defineMessages({
  close: {
    id: 'screens.ExportObservations.Close',
    defaultMessage: 'Close',
  },
});

export const ExportObservations = ({
  navigation,
}: NativeRootNavigationProps<'ExportObservations'>) => {
  const {formatMessage} = useIntl();

  return (
    <BottomSheetWrapper>
      <View style={{alignItems: 'center'}}>
        <HeaderText
          style={{textAlign: 'center', marginTop: 20}}
          variant="header2"></HeaderText>
        <BodyText style={{textAlign: 'center', marginTop: 20}}></BodyText>
      </View>
      <DestructiveButton
        fullSize={true}
        onPress={() => {}}
        style={{marginTop: 20, alignSelf: 'center'}}
        text={''}
      />
      <SecondaryButton
        fullSize={true}
        onPress={() => navigation.goBack()}
        style={{marginTop: 20, alignSelf: 'center'}}
        text={formatMessage(m.close)}
      />
    </BottomSheetWrapper>
  );
};
