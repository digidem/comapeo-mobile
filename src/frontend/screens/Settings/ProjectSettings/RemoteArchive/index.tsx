import {useOwnRoleInProject} from '@comapeo/core-react';
import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {defineMessages, type MessageDescriptor} from 'react-intl';

import {useActiveProject} from '../../../../contexts/ActiveProjectContext';
import {useActiveArchiveServer} from '../../../../hooks/server/projects';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../../../../sharedTypes';
import {type NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {RemoteArchiveOff} from './RemoteArchiveOff';
import {RemoteArchiveOn} from './RemoteArchiveOn';

const m = defineMessages({
  navTitle: {
    id: 'ProjectSettings.RemoteArchive.navTitle',
    defaultMessage: 'Remote Archive',
  },
});

export function RemoteArchiveScreen({
  navigation,
}: NativeRootNavigationProps<'RemoteArchive'>) {
  const {projectId} = useActiveProject();
  const {data: role} = useOwnRoleInProject({projectId});

  const isCoordinator =
    role.roleId === COORDINATOR_ROLE_ID || role.roleId === CREATOR_ROLE_ID;

  const activeArchiveServer = useActiveArchiveServer({projectId});

  return activeArchiveServer ? (
    <RemoteArchiveOn
      archiveBaseUrl={activeArchiveServer.selfHostedServerDetails.baseUrl}
      archiveDateAdded={activeArchiveServer.joinedAt}
      archiveName={activeArchiveServer.name}
      isCoordinator={isCoordinator}
      onRemove={() => {
        navigation.navigate('RemoveRemoteArchive', {
          name: activeArchiveServer.name,
          serverDeviceId: activeArchiveServer.deviceId,
          baseUrl: activeArchiveServer.selfHostedServerDetails.baseUrl,
        });
      }}
    />
  ) : (
    <RemoteArchiveOff
      isCoordinator={isCoordinator}
      onAdd={() => {
        navigation.navigate('AddRemoteArchive');
      }}
    />
  );
}

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return (): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.navTitle),
    };
  };
}
