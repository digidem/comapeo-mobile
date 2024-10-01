import * as React from 'react';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import {COMAPEO_BLUE, DARK_GREY, LIGHT_GREY, RED} from '../../../../lib/styles';
import {HookFormTextInput} from '../../../../sharedComponents/HookFormTextInput';
import {Control, FieldErrors, useForm} from 'react-hook-form';
import {SaveButton} from '../../../../sharedComponents/SaveButton';
import {
  useAddRemoteArchive,
  useFindRemoteArchive,
} from '../../../../hooks/server/projects';
import {Bar} from 'react-native-progress';
import {ScreenContentWithDock} from '../../../../sharedComponents/ScreenContentWithDock';
import {Button} from '../../../../sharedComponents/Button';

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
  looking: {
    id: 'ProjectSettings.RemoteArchive.AddRemoteArchive.looking',
    defaultMessage: 'Looking for Remote Archive...',
  },
  youAreAdding: {
    id: 'ProjectSettings.RemoteArchive.AddRemoteArchive.youAreAdding',
    defaultMessage: 'You are adding:',
  },
  archiveInfo: {
    id: 'ProjectSettings.RemoteArchive.AddRemoteArchive.archiveInfo',
    defaultMessage:
      'When project participants sync their data, they will also be archived on the internet. Your project data is syncing to the archive over the internet to the secure, encrypted server below. The server owner can view the data.',
  },
  permission: {
    id: 'ProjectSettings.RemoteArchive.AddRemoteArchive.permission',
    defaultMessage: 'Only a Project Coordinator can turn off Remote Archive.',
  },
});

type URLInput = {
  url: string;
};

export const AddRemoteArchive: NativeNavigationComponent<
  'AddRemoteArchive'
> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<URLInput>();
  const [queryUrl, setQueryUrl] = React.useState<string>();

  const {data, isLoading, isError} = useFindRemoteArchive({url: queryUrl});

  if (isError && !errors.root) {
    setError('root', {message: 'url not found'});
  }

  const handleFindRemoteArchive = React.useCallback(
    ({url}: URLInput) => {
      setQueryUrl(url);
    },
    [setQueryUrl],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: !isLoading});
  }, [navigation, isLoading]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () =>
        !data ? (
          <SaveButton
            onPress={handleSubmit(handleFindRemoteArchive)}
            isLoading={isLoading}
          />
        ) : null,
    });
  }, [handleFindRemoteArchive, handleSubmit, navigation, isLoading, data]);

  return false ? (
    <FindingRemoteArchive />
  ) : true ? (
    <AddFoundArchive name={'newThing'} url={'data.url.laksjdflka;jo;aie;a'} />
  ) : (
    <SearchUrl control={control} errors={errors} />
  );
};

type SearchUrlProp = {
  control: Control<URLInput>;
  errors: FieldErrors<URLInput>;
};

const SearchUrl = ({control, errors}: SearchUrlProp) => {
  const {formatMessage} = useIntl();
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <Text>{formatMessage(m.url)}</Text>
        <Text style={{color: RED}}>*</Text>
      </View>
      <HookFormTextInput
        control={control}
        name="url"
        rules={{required: true, minLength: 1}}
      />
      {(errors.url || errors.root) && (
        <Text style={{color: RED, marginTop: 10}}>
          {formatMessage(m.invalidUrl)}
        </Text>
      )}
    </View>
  );
};

const FindingRemoteArchive = () => {
  const {formatMessage} = useIntl();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formatMessage(m.looking)}</Text>
      <Bar indeterminate color={COMAPEO_BLUE} width={null} height={20} />
    </View>
  );
};

type AddFoundArchiveProps = {
  name: string;
  url: string;
};

const AddFoundArchive = ({name, url}: AddFoundArchiveProps) => {
  const {formatMessage} = useIntl();
  const {mutate} = useAddRemoteArchive();

  function handleAddRemoteArchive() {
    mutate({}, {onSuccess: () => {}});
  }

  return (
    <ScreenContentWithDock
      dockContent={
        <Button
          onPress={
            handleAddRemoteArchive
          }>{`+ ${formatMessage(m.navTitle)}`}</Button>
      }>
      <Text style={[styles.title, {fontSize: 24}]}>
        {formatMessage(m.youAreAdding)}
      </Text>
      <View style={{alignSelf: 'center', marginBottom: 20}}>
        <Text>{name}</Text>
        <Text>{url}</Text>
      </View>
      <View style={styles.greyBox}>
        <Text>{formatMessage(m.archiveInfo)}</Text>
        <Text>{formatMessage(m.permission)}</Text>
      </View>
    </ScreenContentWithDock>
  );
};

AddRemoteArchive.navTitle = m.navTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    marginBottom: 20,
    fontSize: 32,
    textAlign: 'center',
  },
  greyBox: {
    backgroundColor: LIGHT_GREY,
    padding: 20,
    borderColor: DARK_GREY,
    borderWidth: 1,
    borderRadius: 10,
  },
});
