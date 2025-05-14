import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
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
import * as Sentry from '@sentry/react-native';
import {projectColors} from '../../../constants';

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
  projectColors: {
    id: 'screen.EditProjectDetails.projectColors',
    defaultMessage: 'Project Card Colors',
  },
  descriptionPlaceholder: {
    id: 'screen.EditProjectDetails.descriptionPlaceholder',
    defaultMessage:
      'Short Description of the Project, less than 60 characters.',
  },
});

export const EditProjectDetails: NativeNavigationComponent<
  'EditProjectDetails'
> = ({navigation}) => {
  const {formatMessage} = useIntl();
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {mutate, status} = useUpdateProjectSettings({projectId});
  const {control, setValue, watch, handleSubmit, setError} = useForm<{
    projectName: string;
    color: string;
    projectDescription?: string;
  }>({
    defaultValues: {
      color: projectDetails.projectColor,
      projectName: projectDetails.projectName,
      projectDescription: projectDetails.projectDescription,
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SaveButton
          isLoading={status === 'pending'}
          onPress={handleSubmit(details => {
            if (!details.projectName.trim()) {
              setError('projectName', {type: 'required'});
            }
            mutate(
              {
                projectColor: details.color,
                name: details.projectName.trim(),
                projectDescription: details.projectDescription?.trim(),
              },
              {
                onSuccess: () => {
                  navigation.popTo('Menu');
                },
                onError: err => {
                  Sentry.captureException(err);
                  navigation.navigate('ErrorBottomSheet');
                },
              },
            );
          })}
        />
      ),
    });
  }, [navigation, handleSubmit, mutate, status, setError]);

  return (
    <View>
      <View style={{padding: 20, gap: 10}}>
        <HeaderText variant="header6">
          {formatMessage(m.projectName)}
        </HeaderText>
        <HookFormTextInput
          rules={{maxLength: 60, required: true}}
          style={{textAlignVertical: 'top', fontSize: 20}}
          control={control}
          showCharacterCount={true}
          name="projectName"
          placeholder={`[${formatMessage(m.projectName)}]`}
        />

        <HeaderText variant="header6">
          {formatMessage(m.projectDescription)}
        </HeaderText>
        <HookFormTextInput
          control={control}
          rules={{maxLength: 60, required: false}}
          multiline={true}
          style={{textAlignVertical: 'top', fontSize: 20}}
          showCharacterCount={true}
          name="projectDescription"
          placeholder={`[${formatMessage(m.descriptionPlaceholder)}]`}
        />

        <HeaderText variant="header6">
          {formatMessage(m.projectColors)}
        </HeaderText>
      </View>
      <HorizontalScrollView
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

EditProjectDetails.navTitle = m.navTitle;

const styles = StyleSheet.create({
  colorContainer: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
