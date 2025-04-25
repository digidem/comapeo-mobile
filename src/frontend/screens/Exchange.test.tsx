import {render} from '@testing-library/react-native';

import {SyncScreen} from './Exchange';
import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';

describe('Exchange screen', () => {
  let appProviders: ReturnType<typeof createAppProvidersWrapper>;
  const {manager, fastifyController} = createManager();
  const {client, server, stop} = setUpIPC({manager});

  beforeAll(async () => {
    await fastifyController.start();
  });

  afterAll(async () => {
    await fastifyController.stop();
    server.close();
    await stop();
  });

  beforeEach(() => {
    appProviders = createAppProvidersWrapper({mapeoApi: client});
  });

  afterEach(() => {
    appProviders.teardown();
  });

  test('basic', () => {
    const navigation = {
      goBack: jest.fn(),
    };

    render(
      <SyncScreen
        // @ts-expect-error Not ideal but bare minimum navigation needed by the screen
        navigation={navigation}
      />,
      {wrapper: appProviders.wrapper},
    );
  });
});
