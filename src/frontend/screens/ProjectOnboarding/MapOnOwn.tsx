import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import * as Sentry from '@sentry/react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {useCreateProject} from '@comapeo/core-react';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';

import MapOnOwnIcon from '../../images/NoProjectOrange.svg';

import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {DARK_ORANGE} from '../../lib/styles';

const m = defineMessages({
  screenTitle: {
    id: 'ProjectOnboarding.MapOnOwn.title',
    defaultMessage: 'Map on Your Own',
  },
  bodyText: {
    id: 'ProjectOnboarding.MapOnOwn.bodyText',
    defaultMessage:
      'Explore everything CoMapeo offers without inviting others to participate.',
  },
  goBackButton: {
    id: 'ProjectOnboarding.MapOnOwn.goBackButton',
    defaultMessage: 'Go Back',
  },
  startMappingButton: {
    id: 'ProjectOnboarding.MapOnOwn.startMappingButton',
    defaultMessage: 'Start Mapping',
  },
});

type Props = NativeRootNavigationProps<'MapOnOwn'>;

export const MapOnOwn: React.FC<Props> = ({navigation}) => {
  const {formatMessage: t} = useIntl();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const createProjectMutation = useCreateProject();

  const isPending = createProjectMutation.status === 'pending';

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (!isPending) return;
      if (
        event.data.action.type === 'GO_BACK' ||
        event.data.action.type === 'POP'
      )
        event.preventDefault();
    });
    return unsubscribe;
  }, [navigation, isPending]);

  function handleGoBack() {
    if (isPending) return;
    navigation.goBack();
  }

  const handleStartMapping = () => {
    if (isPending) return;

    const onError = (err: unknown) => {
      Sentry.captureException(err);
      navigation.navigate('ErrorBottomSheet');
    };

    createProjectMutation.mutate(
      {name: undefined},
      {
        onSuccess: projectId => {
          setActiveProjectId(projectId);
        },
        onError,
      },
    );
  };

  return (
    <ScreenContentWithDock
      dockContent={
        <View style={styles.buttonsContainer}>
          {isPending ? (
            <UIActivityIndicator size={30} style={{flex: 0}} />
          ) : (
            <>
              <SecondaryButton
                fullSize={true}
                text={t(m.goBackButton)}
                onPress={handleGoBack}
              />
              <PrimaryButton
                fullSize
                text={t(m.startMappingButton)}
                onPress={handleStartMapping}
              />
            </>
          )}
        </View>
      }>
      <View style={styles.contentArea}>
        <MapOnOwnIcon color={DARK_ORANGE} width={80} height={80} />
        <HeaderText style={styles.title}>{t(m.screenTitle)}</HeaderText>
        <BodyText style={styles.bodyText}>{t(m.bodyText)}</BodyText>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentArea: {
    alignItems: 'center',
    gap: 35,
    paddingTop: 40,
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bodyText: {
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 21,
  },
  buttonsContainer: {
    gap: 15,
  },
});
