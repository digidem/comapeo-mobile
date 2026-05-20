import path from 'path';
import {screen, userEvent} from '@testing-library/react-native';
import {setupIntegrationTest} from '../../../../tests/integration/helpers/setupIntegrationTest';

const DEFAULT_CONFIG_PATH = path.join(
  __dirname,
  '../../../../src/backend/node_modules/@comapeo/default-categories/dist/comapeo-default-categories.comapeocat',
);

describe('Observation Fields', () => {
  const integrationSetup = setupIntegrationTest();

  test('has the correct fields', async () => {
    const user = userEvent.setup();

    const project = await integrationSetup.manager.getProject(
      integrationSetup.projectId,
    );
    await project.$importCategories({filePath: DEFAULT_CONFIG_PATH});

    await integrationSetup.renderNavigation({
      activeProjectId: integrationSetup.projectId,
    });

    const observationButton = await screen.findByTestId(
      'MAIN.add-observation-btn',
    );
    expect(observationButton).toBeVisible();

    await user.press(observationButton);
    const categoryScreen = await screen.findByTestId('MAIN.categories-scrn');
    expect(categoryScreen).toBeVisible();

    const animalCategory = await screen.findByText('Animal');
    expect(animalCategory).toBeVisible();
  });
});
