import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {VERY_LIGHT_GREY, BLACK} from '../../lib/styles';
import {useOwnRoleInProject, useProjectSettings} from '@comapeo/core-react';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';

const m = defineMessages({
  close: {
    id: 'screens.RemovedFromProjectBottomSheet.close',
    defaultMessage: 'Close',
  },
  title: {
    id: 'screens.RemovedFromProjectBottomSheet.title',
    defaultMessage: 'THIS DEVICE REMOVED FROM…',
  },
  reasonLabel: {
    id: 'screens.RemovedFromProjectBottomSheet.reasonLabel',
    defaultMessage: 'Reason: {reason}',
  },
});

export const RemovedFromProjectBottomSheet = ({
  route,
  navigation,
}: NativeRootNavigationProps<'RemovedFromProjectBottomSheet'>) => {
  const {formatMessage} = useIntl();
  const {projectId} = route.params;
  const {
    data: {reason},
  } = useOwnRoleInProject({projectId});
  const {
    data: {name, projectColor},
  } = useProjectSettings({projectId});
  const {setActiveProjectId} = useActiveProjectIdActions();

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <HeaderText variant="header6" style={styles.titleText}>
          {formatMessage(m.title)}
        </HeaderText>

        <View
          style={[
            styles.projectCard,
            {backgroundColor: projectColor || '#EEF6EE'},
          ]}>
          <HeaderText variant="header2" style={styles.projectName}>
            {name}
          </HeaderText>
          {reason && (
            <HeaderText variant="header5" style={styles.reasonText}>
              {formatMessage(m.reasonLabel, {reason})}
            </HeaderText>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <SecondaryButton
            fullSize
            onPress={() => {}}
            text={formatMessage(m.close)}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  titleText: {
    textTransform: 'uppercase',
    color: BLACK,
  },
  projectCard: {
    padding: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: VERY_LIGHT_GREY,
    gap: 20,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 1,
  },
  projectName: {
    color: BLACK,
  },
  reasonText: {},
  buttonContainer: {
    paddingTop: 18,
    alignItems: 'center',
  },
});
