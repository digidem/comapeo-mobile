import * as React from 'react';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  COMAPEO_BLUE,
  BLUE_GREY,
  RED,
  VERY_LIGHT_GREY,
} from '../../../../lib/styles';
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
import {useNavigationFromRoot} from '../../../../hooks/useNavigationWithTypes';
import {normalizeRemoteArchiveUrl} from '../../../../utils/normalizeRemoteArchiveUrl';
import {ErrorBottomSheetDeprecated} from '../../../../sharedComponents/ErrorBottomSheetDeprecated';
import {UIActivityIndicator} from 'react-native-indicators';
import {
  BottomSheetModal,
  useBottomSheetModal,
} from '../../../../sharedComponents/BottomSheetModal';
import {WhatsIncludedBottomSheetContent} from './WhatsIncludedBottomSheetContent';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';

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
  whatsIncluded: {
    id: 'ProjectSettings.RemoteArchive.AddRemoteArchive.whatsIncluded',
    defaultMessage: 'See What is Included',
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
  const [normalizedUrl, setNormalizedUrl] = React.useState<string>('');

  const {
    isLoading: urlSearching,
    data: archiveName,
    isError,
  } = useFindRemoteArchive({
    url: normalizedUrl ? new URL('/info', normalizedUrl).toString() : undefined,
  });

  React.useEffect(() => {
    if (isError) {
      setError('url', {type: 'required'});
    }
  }, [isError, setError]);

  const handleFindRemoteArchive = React.useCallback(
    ({url}: URLInput) => {
      try {
        setNormalizedUrl(normalizeRemoteArchiveUrl(url));
      } catch {
        setError('url', {type: 'required'});
      }
    },
    [setNormalizedUrl, setError],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        !archiveName ? (
          <SaveButton
            onPress={handleSubmit(handleFindRemoteArchive)}
            isLoading={false}
          />
        ) : null,
    });
  }, [handleFindRemoteArchive, handleSubmit, navigation, archiveName]);

  if (urlSearching) {
    return <FindingRemoteArchive />;
  }

  if (archiveName) {
    return <AddFoundArchive name={archiveName} url={normalizedUrl} />;
  }

  return <SearchUrl control={control} errors={errors} />;
};

type SearchUrlProp = {
  control: Control<URLInput>;
  errors: FieldErrors<URLInput>;
};

const SearchUrl = ({control, errors}: SearchUrlProp) => {
  const {formatMessage} = useIntl();
  const navigation = useNavigationFromRoot();

  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: true});
  }, [navigation]);
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <HeaderText variant="header5">{formatMessage(m.url)}</HeaderText>
        <HeaderText variant="header5" style={{color: RED}}>
          *
        </HeaderText>
      </View>
      <HookFormTextInput
        control={control}
        name="url"
        rules={{required: true, minLength: 1}}
      />
      {(errors.url || errors.root) && (
        <HeaderText variant="header6" style={{color: RED, marginTop: 10}}>
          {formatMessage(m.invalidUrl)}
        </HeaderText>
      )}
    </View>
  );
};

const FindingRemoteArchive = () => {
  const {formatMessage} = useIntl();
  const navigation = useNavigationFromRoot();

  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);

  return (
    <View style={[styles.container, {marginTop: 80}]}>
      <HeaderText style={styles.title}>{formatMessage(m.looking)}</HeaderText>
      <Bar
        style={{borderWidth: 0, marginTop: 30}}
        indeterminate
        color={COMAPEO_BLUE}
        width={null}
        height={10}
      />
    </View>
  );
};

type AddFoundArchiveProps = {
  name: string;
  url: string;
};

const AddFoundArchive = ({name, url}: AddFoundArchiveProps) => {
  const {formatMessage} = useIntl();
  const {mutate, error, reset, isPending} = useAddRemoteArchive();
  const {navigate, setOptions, addListener} = useNavigationFromRoot();
  const {openSheet, isOpen, closeSheet, sheetRef} = useBottomSheetModal({
    openOnMount: false,
  });
  function handleAddRemoteArchive() {
    mutate(url, {
      onSuccess: () => {
        navigate('SuccessfullyAddedArchive', {archiveName: name, url});
      },
    });
  }

  React.useEffect(() => {
    const unsubscribe = addListener('beforeRemove', e => {
      if (!isPending) {
        // If user is not actively adding server
        return;
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault();
    });
    return () => {
      unsubscribe();
    };
  }, [addListener, isPending]);

  React.useLayoutEffect(() => {
    setOptions({headerShown: true});
  }, [setOptions]);

  return (
    <>
      <ScreenContentWithDock
        dockContent={
          isPending ? (
            <UIActivityIndicator style={{marginBottom: 20}} />
          ) : (
            <Button
              fullWidth
              onPress={
                handleAddRemoteArchive
              }>{`+ ${formatMessage(m.navTitle)}`}</Button>
          )
        }>
        <HeaderText variant="header4" style={styles.title}>
          {formatMessage(m.youAreAdding)}
        </HeaderText>
        <View style={{alignSelf: 'center', marginBottom: 20}}>
          <HeaderText variant="header5">{name}</HeaderText>
          <BodyText variant="smallMeta">{url}</BodyText>
        </View>
        <View style={styles.greyBox}>
          <BodyText variant="smallMeta">
            {formatMessage(m.archiveInfo)}
          </BodyText>
          <BodyText style={{marginTop: 5}} variant="smallMeta">
            {formatMessage(m.permission)}
          </BodyText>
          <TouchableOpacity onPress={openSheet}>
            <HeaderText
              variant="header5"
              style={{color: COMAPEO_BLUE, marginTop: 10}}>
              {formatMessage(m.whatsIncluded)}
            </HeaderText>
          </TouchableOpacity>
        </View>
      </ScreenContentWithDock>
      <ErrorBottomSheetDeprecated error={error} clearError={reset} />
      <BottomSheetModal isOpen={isOpen} ref={sheetRef}>
        <WhatsIncludedBottomSheetContent closeSheet={closeSheet} />
      </BottomSheetModal>
    </>
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
    textAlign: 'center',
  },
  greyBox: {
    backgroundColor: VERY_LIGHT_GREY,
    padding: 20,
    borderColor: BLUE_GREY,
    borderWidth: 1,
    borderRadius: 10,
  },
});
