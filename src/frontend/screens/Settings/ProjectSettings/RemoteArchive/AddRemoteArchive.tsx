import * as React from 'react';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import {RED} from '../../../../lib/styles';
import {HookFormTextInput} from '../../../../sharedComponents/HookFormTextInput';
import {useForm} from 'react-hook-form';
import {SaveButton} from '../../../../sharedComponents/SaveButton';

const m = defineMessages({
  navTitle: {
    id: 'ProjectSettings.RemoteArchive.AddRemoteArchive.navTitle',
    defaultMessage: 'Add Remote Archive',
  },
  url: {
    id: 'ProjectSettings.RemoteArchive.AddRemoteArchive.url',
    defaultMessage: 'Url',
  },
  invalidUrl: {
    id: 'ProjectSettings.RemoteArchive.AddRemoteArchive.invalidUrl',
    defaultMessage: 'Invalid URL',
  },
});

export const AddRemoteArchive: NativeNavigationComponent<
  'AddRemoteArchive'
> = ({navigation}) => {
  const {formatMessage} = useIntl();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<{url: string}>({
    defaultValues: {url: ''},
  });

  const handleCreateProject = React.useCallback(
    ({url}: {url: string}) => {},
    [],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <SaveButton
          onPress={() => {
            handleSubmit(handleCreateProject);
          }}
          isLoading={false}
        />
      ),
    });
  }, [handleCreateProject, handleSubmit, navigation]);

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Text>{formatMessage(m.url)}</Text>
        <Text style={{color: RED}}>*</Text>
      </View>
      <HookFormTextInput
        control={control}
        name="url"
        rules={{required: true, minLength: 1}}
      />
      {errors && (
        <Text style={{color: RED}}>{formatMessage(m.invalidUrl)}</Text>
      )}
    </View>
  );
};

AddRemoteArchive.navTitle = m.navTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
});
