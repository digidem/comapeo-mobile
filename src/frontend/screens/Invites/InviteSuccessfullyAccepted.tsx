import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import SuccessCheck from '../../images/Success.svg';

const m = defineMessages({
  done: {
    id: 'screens.InviteSuccess.done',
    defaultMessage: 'Done',
  },
  success: {
    id: 'screens.InviteSuccess.success',
    defaultMessage: 'Success',
  },
  youHaveJoined: {
    id: 'screens.InviteSuccess.youHaveJoined',
    defaultMessage: 'You have joined {projectName}',
  },
});

export const InviteSuccessfullyAccepted = ({
  route,
  navigation,
}: NativeRootNavigationProps<'InviteSuccessfullyAccepted'>) => {
  const {formatMessage} = useIntl();

  return (
    <BottomSheetWrapper>
      <SuccessCheck style={{alignSelf: 'center'}} />
      <HeaderText
        style={{textAlign: 'center', marginTop: 20}}
        variant="header2">
        {formatMessage(m.success)}
      </HeaderText>
      <BodyText style={{textAlign: 'center', marginTop: 20}}>
        {formatMessage(m.youHaveJoined, {
          projectName: route.params.projectName,
        })}
      </BodyText>
      <View style={styles.buttonContainer}>
        <>
          <SecondaryButton
            fullSize
            onPress={() => navigation.popTo('Home', {screen: 'Map'})}
            text={formatMessage(m.done)}
          />
        </>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});
