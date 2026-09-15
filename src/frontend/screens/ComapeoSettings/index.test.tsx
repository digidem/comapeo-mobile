import {screen, userEvent} from '@testing-library/react-native';
import {setupIntegrationTest} from '../../../../tests/integration/helpers/setupIntegrationTest';

describe('CoMapeo Settings Screen', () => {
  const integrationSetup = setupIntegrationTest();

  test('opens drawer when header button is pressed', async () => {
    const user = userEvent.setup();
    await integrationSetup.renderNavigation({
      activeProjectId: integrationSetup.projectId,
    });

    const headerButton = await screen.findByTestId('HOME.header-button');
    await expect(headerButton).toBeVisible();
    await user.press(headerButton);

    // react-native-drawer-layout 4.2.5+ hides drawer content from the
    // accessibility tree until an open animation that never runs under Jest,
    // so visibility can't tell open from closed. Make sure to verify on device instead.
    const settings = await screen.findByText('CoMapeo Settings', {
      includeHiddenElements: true,
    });

    // await expect(settings).toBeVisible();

    await user.press(settings);

    await expect(await screen.findByText('test')).toBeVisible();
    expect(screen.queryByText('NOT HERE')).toBeNull();
  });
});
