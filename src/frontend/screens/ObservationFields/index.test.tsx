import path from 'path';
import {screen, userEvent} from '@testing-library/react-native';
import {setupIntegrationTest} from '../../../../tests/integration/helpers/setupIntegrationTest';

const DEFAULT_CONFIG_PATH = path.join(
  path.dirname(require.resolve('@comapeo/default-categories/package.json')),
  'dist/comapeo-default-categories.comapeocat',
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

    await user.press(animalCategory);

    const details = await screen.findByText('Details');
    await user.press(details);

    // through manually clicking through the app, I know that this should be a text input
    const textInput = await screen.findByTestId('OBS.text-inp');
    expect(textInput).toBeVisible();

    const nextButton = await screen.findByText('Next');
    await user.press(nextButton);

    const selectOne = await screen.findByTestId('OBS.select-one-inp');
    expect(selectOne).toBeVisible();

    await user.press(nextButton);
    expect(selectOne).toBeVisible();

    await user.press(nextButton);
    expect(selectOne).toBeVisible();

    await user.press(nextButton);
    const selectMultiple = await screen.findByTestId('OBS.select-multiple-inp');

    expect(selectMultiple).toBeVisible();

    const doneButton = await screen.findByText('Done');
    expect(doneButton).toBeVisible();

    await user.press(doneButton);
    expect(await screen.findByTestId('OBS.create-obs')).toBeVisible();
  });
});
