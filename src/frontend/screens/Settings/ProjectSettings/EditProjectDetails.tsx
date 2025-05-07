import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {defineMessages, MessageDescriptor, useIntl} from 'react-intl';
import {HookFormTextInput} from '../../../sharedComponents/HookFormTextInput';
import {useForm} from 'react-hook-form';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {HorizontalMediaScrollView} from '../../../sharedComponents/HorizontalMediaScrollView';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {COMAPEO_BLUE} from '../../../lib/styles';
import {useProjectRoleAndDetails} from '../../../hooks/useProjectRoleAndDetails';
import {useActiveProject} from '../../../contexts/ActiveProjectContext';

const m = defineMessages({
  projectName: {
    id: 'screen.EditProjectDetails.projectName',
    defaultMessage: 'Project Name',
  },
  projectDescription: {
    id: 'screen.EditProjectDetails.projectDescription',
    defaultMessage: 'Project Description',
  },
  navTitle: {
    id: 'screen.EditProjectDetails.navTitle',
    defaultMessage: 'Edit Info',
  },
  orange: {
    id: 'screen.EditProjectDetails.orange',
    defaultMessage: 'Orange',
  },
  blue: {
    id: 'screen.EditProjectDetails.blue',
    defaultMessage: 'Blue',
  },
  green: {
    id: 'screen.EditProjectDetails.green',
    defaultMessage: 'Green',
  },
  red: {
    id: 'screen.EditProjectDetails.red',
    defaultMessage: 'Red',
  },
  grey: {
    id: 'screen.EditProjectDetails.grey',
    defaultMessage: 'Grey',
  },
  projectColors: {
    id: 'screen.EditProjectDetails.projectColors',
    defaultMessage: 'Project Card Colors',
  },
});

export const EditProjectDetails: NativeNavigationComponent<
  'EditProjectDetails'
> = () => {
  const {formatMessage} = useIntl();
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {control, setValue, watch} = useForm<{
    projectName: string;
    projectDescription?: string;
    color: string;
  }>({
    defaultValues: {
      color: '#FFF5EB',
      projectName: projectDetails.projectName,
      projectDescription: projectDetails.projectDescription,
    },
  });

  const selectedColor = watch('color');
  return (
    <View style={{padding: 20, gap: 10}}>
      <HeaderText variant="header6">{formatMessage(m.projectName)}</HeaderText>
      <HookFormTextInput
        rules={{maxLength: 60}}
        control={control}
        showCharacterCount={true}
        name="projectName"
      />

      <HeaderText variant="header6">
        {formatMessage(m.projectDescription)}
      </HeaderText>
      <HookFormTextInput
        rules={{maxLength: 60}}
        control={control}
        showCharacterCount={true}
        name="projectDescription"
      />

      <HeaderText variant="header6">
        {formatMessage(m.projectColors)}
      </HeaderText>
      <HorizontalMediaScrollView
        numberOfAttachments={projectColors.length}
        minThumbnailSize={60}
        gap={16}
        shouldShowLastItems={false}
        renderThumbnailChildren={size => {
          return (
            <>
              {projectColors.map(({color, label}) => {
                return (
                  <View style={{alignItems: 'center'}} key={color}>
                    <TouchableOpacity
                      style={[
                        styles.colorContainer,
                        {backgroundColor: color, width: size, height: size},
                        selectedColor === color && {
                          borderColor: COMAPEO_BLUE,
                          borderWidth: 5,
                        },
                      ]}
                      onPress={() => {
                        setValue('color', color);
                      }}
                    />
                    <BodyText variant={'tinyMeta'}>
                      {formatMessage(label)}
                    </BodyText>
                  </View>
                );
              })}
            </>
          );
        }}
      />
    </View>
  );
};

type projectColor = {
  label: MessageDescriptor;
  color: string;
};

const projectColors: projectColor[] = [
  {color: '#FFF5EB', label: m.orange},
  {color: '#E5F0FF', label: m.blue},
  {color: '#EEF6EE', label: m.green},
  {color: '#FBE9E9', label: m.red},
  {color: '#E5E5EB', label: m.grey},
];

EditProjectDetails.navTitle = m.navTitle;

const styles = StyleSheet.create({
  colorContainer: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
