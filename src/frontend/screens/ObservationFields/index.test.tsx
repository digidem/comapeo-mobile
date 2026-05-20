import {act, screen, userEvent} from '@testing-library/react-native';
import {setupIntegrationTest} from '../../../../tests/integration/helpers/setupIntegrationTest';

describe('Observation Fields', () => {
  const integrationSetup = setupIntegrationTest();

  test('has the correct fields', async () => {
    const user = userEvent.setup();
    await integrationSetup.renderNavigation({
      activeProjectId: integrationSetup.projectId,
    });

    const observationButton = await screen.findByTestId(
      'MAIN.add-observation-btn',
    );
    expect(observationButton).toBeVisible();

    await act(async () => {
      await user.press(observationButton);
      const categoryScreen = await screen.findByText('Choose a category');
      await expect(categoryScreen).toBeVisible();
    });
  });
});
