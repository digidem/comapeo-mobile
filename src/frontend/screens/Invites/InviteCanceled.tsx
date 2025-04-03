import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import Error from '../../images/Error.svg';

const m = defineMessages({
  close: {
    id: 'screens.InviteCancelled.close',
    defaultMessage: 'Close',
  },
  canceled: {
    id: 'screens.InviteCancelled.canceled',
    defaultMessage: 'Invite Canceled',
  },
  projectInviteCanceled: {
    id: 'screens.InviteCancelled.projectInviteCanceled',
    defaultMessage: 'Your invitation to {projectName} has been canceled.',
  },
});

export const InviteCanceled = ({
  route,
  navigation,
}: NativeRootNavigationProps<'InviteCanceled'>) => {
  const {formatMessage} = useIntl();

  return (
    <BottomSheetWrapper>
      <Error style={{alignSelf: 'center', marginTop: 10}} />
      <HeaderText
        style={{textAlign: 'center', marginTop: 20}}
        variant="header2">
        {formatMessage(m.canceled)}
      </HeaderText>
      <BodyText style={{textAlign: 'center', marginTop: 20}}>
        {formatMessage(m.projectInviteCanceled, {
          projectName: route.params.projectName,
        })}
      </BodyText>
      <View style={styles.buttonContainer}>
        <SecondaryButton
          fullSize
          onPress={() => navigation.goBack()}
          text={formatMessage(m.close)}
        />
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
});
