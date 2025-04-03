import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {CommonActions, useNavigation} from '@react-navigation/native';
import SuccessCheck from '../../images/GreenCheck.svg';

const m = defineMessages({
  goToMap: {
    id: 'screens.InviteSuccess.goToMap',
    defaultMessage: 'Go To Map',
  },
  success: {
    id: 'screens.InviteSuccess.success',
    defaultMessage: 'Success',
  },
  youHaveJoined: {
    id: 'screens.InviteSuccess.youHaveJoined',
    defaultMessage: 'You have joined {projectName}',
  },
  goToSync: {
    id: 'screens.InviteSuccess.goToSync',
    defaultMessage: 'Go To Sync',
  },
});

export const InviteSuccessfullyAccepted = ({
  route,
  navigation,
}: NativeRootNavigationProps<'InviteSuccessfullyAccepted'>) => {
  const {formatMessage} = useIntl();
  const {dispatch} = useNavigation();

  function handleGoToSync() {
    dispatch(
      CommonActions.reset({index: 1, routes: [{name: 'Home'}, {name: 'Sync'}]}),
    );
  }

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
            text={formatMessage(m.goToMap)}
          />
          <PrimaryButton
            fullSize
            style={{marginTop: 10}}
            onPress={handleGoToSync}
            text={formatMessage(m.goToSync)}
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
