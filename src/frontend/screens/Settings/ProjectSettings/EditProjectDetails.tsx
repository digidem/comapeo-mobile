import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {defineMessages, MessageDescriptor, useIntl} from 'react-intl';
import {HookFormTextInput} from '../../../sharedComponents/HookFormTextInput';
import {useForm} from 'react-hook-form';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {COMAPEO_BLUE} from '../../../lib/styles';
import {useProjectRoleAndDetails} from '../../../hooks/useProjectRoleAndDetails';
import {useActiveProject} from '../../../contexts/ActiveProjectContext';
import {HorizontalScrollView} from '../../../sharedComponents/HorizontalScrollView';
import {SaveButton} from '../../../sharedComponents/SaveButton';
import {useEffect} from 'react';
import {useUpdateProjectSettings} from '@comapeo/core-react';

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
> = ({navigation}) => {
  const {formatMessage} = useIntl();
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {mutate, status} = useUpdateProjectSettings({projectId});
  const {control, setValue, watch, handleSubmit} = useForm<{
    projectName: string;
    color: string;
  }>({
    defaultValues: {
      color: projectDetails.projectColor,
      projectName: projectDetails.projectName,
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SaveButton
          isLoading={status === 'pending'}
          onPress={handleSubmit(details => {
            mutate(
              {
                projectColor: details.color,
                name: details.projectName,
              },
              {
                onSuccess: newVal => {
                  console.log({newVal});
                },
              },
            );
          })}
        />
      ),
    });
  }, [navigation, handleSubmit, mutate, status]);

  return (
    <View>
      <View style={{padding: 20, gap: 10}}>
        <HeaderText variant="header6">
          {formatMessage(m.projectName)}
        </HeaderText>
        <HookFormTextInput
          rules={{maxLength: 60}}
          control={control}
          showCharacterCount={true}
          name="projectName"
        />

        <HeaderText variant="header6">
          {formatMessage(m.projectDescription)}
        </HeaderText>
        {/* <HookFormTextInput
          rules={{maxLength: 60, required: false}}
          control={control}
          showCharacterCount={true}
          name="projectDescription"
        /> */}

        <HeaderText variant="header6">
          {formatMessage(m.projectColors)}
        </HeaderText>
      </View>
      <HorizontalScrollView
        numberOfItems={projectColors.length}
        minItemWidth={60}
        gap={16}
        shouldShowLastItems={false}
        renderChildren={size => {
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
