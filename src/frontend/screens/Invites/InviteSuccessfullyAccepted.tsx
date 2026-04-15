import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import SuccessCheck from '../../images/Success.svg';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';

const m = defineMessages({
  done: {
    id: '$1screens.InviteSuccess.done',
    defaultMessage: 'Done',
  },
  success: {
    id: '$1screens.InviteSuccess.success',
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
  const {setActiveProjectId} = useActiveProjectIdActions();

  return (
    <BottomSheetWrapper>
      <IconTitleDescription
        icon={<SuccessCheck />}
        title={formatMessage(m.success)}
        description={formatMessage(m.youHaveJoined, {
          projectName: route.params.projectName,
        })}
      />
      <View style={styles.buttonContainer}>
        <>
          <SecondaryButton
            fullSize
            onPress={() => {
              setActiveProjectId(route.params.projectId);
              navigation.goBack();
            }}
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
