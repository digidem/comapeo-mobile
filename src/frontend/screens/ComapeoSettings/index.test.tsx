import {screen, userEvent} from '@testing-library/react-native';
import {setupIntegrationTest} from '../../../../tests/integration/helpers/setupIntegrationTest';

describe('CoMapeo Settings Screen', () => {
  const integrationSetup = setupIntegrationTest();

  test('opens drawer when header button is pressed', async () => {
    const user = userEvent.setup();
    integrationSetup.renderNavigation({
      activeProjectId: integrationSetup.projectId,
    });

    const headerButton = await screen.findByTestId('HOME.header-button');
    await expect(headerButton).toBeVisible();
    await user.press(headerButton);

    const settings = await screen.findByText('CoMapeo Settings');

    await expect(settings).toBeVisible();

    await user.press(settings);

    await expect(await screen.findByText('test')).toBeVisible();
    expect(screen.queryByText('NOT HERE')).toBeNull();
  });
});
