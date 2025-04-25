import {render} from '@testing-library/react-native';

import {SyncScreen} from './Exchange';
import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';

describe('Exchange screen', () => {
  const {manager, fastifyController} = createManager();
  const {client, server} = setUpIPC({manager});

  beforeAll(() => {
    fastifyController.start();
  });

  afterAll(() => {
    fastifyController.stop();
    server.close();
  });

  test('basic', () => {
    const wrapper = createAppProvidersWrapper({mapeoApi: client});

    const navigation = {
      goBack: jest.fn(),
    };

    render(
      <SyncScreen
        // @ts-expect-error Not ideal but bare minimum navigation needed by the screen
        navigation={navigation}
      />,
      {wrapper},
    );
  });
});
