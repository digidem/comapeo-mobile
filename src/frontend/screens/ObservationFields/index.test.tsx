import path from 'path';
import {screen, userEvent, fireEvent} from '@testing-library/react-native';
import {setupIntegrationTest} from '../../../../tests/integration/helpers/setupIntegrationTest';

const DEFAULT_CONFIG_PATH = path.join(
  __dirname,
  '../../../../tests/assets/comapeo-categories-devtest.comapeocat',
);

describe('Observation Fields', () => {
  describe('TextArea field', () => {
    const integrationSetup = setupIntegrationTest();

    async function navigateToTextField(
      user: ReturnType<typeof userEvent.setup>,
    ) {
      const project = await integrationSetup.manager.getProject(
        integrationSetup.projectId,
      );
      await project.$importCategories({filePath: DEFAULT_CONFIG_PATH});

      await integrationSetup.renderNavigation({
        activeProjectId: integrationSetup.projectId,
      });

      await user.press(await screen.findByTestId('MAIN.add-observation-btn'));
      // category set in assets folder has a category "Comprehensive Test" with all fields
      await user.press(await screen.findByText('Comprehensive Test'));
      await user.press(await screen.findByText('Details'));
    }
    test('expects text value to change on screen, and remain when navigated back', async () => {
      const user = userEvent.setup();
      await navigateToTextField(user);
      const textInput = await screen.findByTestId('OBS.text-inp');

      fireEvent.changeText(textInput, 'hello');
      expect(textInput).toHaveDisplayValue('hello');

      await user.press(await screen.findByTestId('MAIN.header-back-btn'));
      await user.press(await screen.findByText('Details'));

      expect(await screen.findByTestId('OBS.text-inp')).toHaveDisplayValue(
        'hello',
      );
    });

    test('renders empty when tagValue is undefined/null', async () => {
      const user = userEvent.setup();
      await navigateToTextField(user);
      const textInput = await screen.findByTestId('OBS.text-inp');

      fireEvent.changeText(textInput, null);

      expect(textInput).toHaveDisplayValue('');
    });

    test('renders empty when tagValue is not a string', async () => {
      const user = userEvent.setup();
      await navigateToTextField(user);
      const textInput = await screen.findByTestId('OBS.text-inp');

      fireEvent.changeText(textInput, {foo: 'bar'});

      expect(textInput).toHaveDisplayValue('');
    });

    test('calls updateTag with empty string when cleared', async () => {
      const user = userEvent.setup();
      await navigateToTextField(user);
      const textInput = await screen.findByTestId('OBS.text-inp');

      fireEvent.changeText(textInput, 'some text');
      expect(textInput).toHaveDisplayValue('some text');
      fireEvent.changeText(textInput, '');

      expect(textInput).toHaveDisplayValue('');
    });
  });

  describe('Number Fields', () => {
    const integrationSetup = setupIntegrationTest();

    async function navigateToTextField(
      user: ReturnType<typeof userEvent.setup>,
    ) {
      const project = await integrationSetup.manager.getProject(
        integrationSetup.projectId,
      );
      await project.$importCategories({filePath: DEFAULT_CONFIG_PATH});

      await integrationSetup.renderNavigation({
        activeProjectId: integrationSetup.projectId,
      });

      await user.press(await screen.findByTestId('MAIN.add-observation-btn'));
      // category set in assets folder has a category "Comprehensive Test" with all fields
      await user.press(await screen.findByText('Comprehensive Test'));
      await user.press(await screen.findByText('Details'));
      await user.press(await screen.findByText('Next'));
    }

    test('expects number value to change on screen, and remain when navigated back', async () => {
      const user = userEvent.setup();
      await navigateToTextField(user);
      const numberInput = await screen.findByTestId('OBS.number-inp');

      fireEvent.changeText(numberInput, '1.23');
      expect(numberInput).toHaveDisplayValue('1.23');

      await user.press(await screen.findByTestId('MAIN.header-back-btn'));
      await user.press(await screen.findByTestId('MAIN.header-back-btn'));
      await user.press(await screen.findByText('Details'));
      await user.press(await screen.findByText('Next'));

      expect(await screen.findByTestId('OBS.number-inp')).toHaveDisplayValue(
        '1.23',
      );
    });

    test('sanitizes numbers properly', async () => {
      const user = userEvent.setup();
      await navigateToTextField(user);
      const numberInput = await screen.findByTestId('OBS.number-inp');

      fireEvent.changeText(numberInput, '.');
      expect(numberInput).toHaveDisplayValue('0.');

      fireEvent.changeText(numberInput, '-');
      expect(numberInput).toHaveDisplayValue('-');

      fireEvent.changeText(numberInput, '-08');
      expect(numberInput).toHaveDisplayValue('-8');

      fireEvent.changeText(numberInput, '1.2.34');
      expect(numberInput).toHaveDisplayValue('1.234');

      fireEvent.changeText(numberInput, '-0');
      expect(numberInput).toHaveDisplayValue('-0');

      //should save -0 as 0
      await user.press(await screen.findByTestId('MAIN.header-back-btn'));
      await user.press(await screen.findByTestId('MAIN.header-back-btn'));
      await user.press(await screen.findByText('Details'));
      await user.press(await screen.findByText('Next'));

      expect(await screen.findByTestId('OBS.number-inp')).toHaveDisplayValue(
        '0',
      );
    });
  });

  describe('Select one', () => {
    const integrationSetup = setupIntegrationTest();

    async function navigateToSelectOne(
      user: ReturnType<typeof userEvent.setup>,
    ) {
      const project = await integrationSetup.manager.getProject(
        integrationSetup.projectId,
      );
      await project.$importCategories({filePath: DEFAULT_CONFIG_PATH});

      await integrationSetup.renderNavigation({
        activeProjectId: integrationSetup.projectId,
      });

      await user.press(await screen.findByTestId('MAIN.add-observation-btn'));
      // category set in assets folder has a category "Comprehensive Test" with all fields
      await user.press(await screen.findByText('Comprehensive Test'));
      await user.press(await screen.findByText('Details'));
      await user.press(await screen.findByText('Next'));
      await user.press(await screen.findByText('Next'));
    }

    test('expects select one to be visible and is able to select', async () => {
      const user = userEvent.setup();
      await navigateToSelectOne(user);
      const option = await screen.findByText('Expected');
      await user.press(option);
      const inputExpected = await screen.findByTestId(
        'OBS.select-one-inp-Expected',
      );
      expect(inputExpected).toBeChecked();
      const inputUnusual = await screen.findByTestId(
        'OBS.select-one-inp-Unusual',
      );
      expect(inputUnusual).not.toBeChecked();
      // await user.press(await screen.findByText('expected'));
    });
  });
});

// test('has the correct fields', async () => {
//     const user = userEvent.setup();

//     const project = await integrationSetup.manager.getProject(
//       integrationSetup.projectId,
//     );
//     await project.$importCategories({filePath: DEFAULT_CONFIG_PATH});

//     await integrationSetup.renderNavigation({
//       activeProjectId: integrationSetup.projectId,
//     });

//     const observationButton = await screen.findByTestId(
//       'MAIN.add-observation-btn',
//     );
//     expect(observationButton).toBeVisible();

//     await user.press(observationButton);
//     const categoryScreen = await screen.findByTestId('MAIN.categories-scrn');
//     expect(categoryScreen).toBeVisible();

//     // category set in assets folder has a category "Comprehensive Test" with all fields
//     const catWithAllFields = await screen.findByText('Comprehensive Test');
//     expect(catWithAllFields).toBeVisible();

//     await user.press(catWithAllFields);

//     const details = await screen.findByText('Details');
//     await user.press(details);

//     const textInput = await screen.findByTestId('OBS.text-inp');
//     expect(textInput).toBeVisible();

//     const nextButton = await screen.findByText('Next');
//     await user.press(nextButton);

//     const number = await screen.findByTestId('OBS.number-inp');
//     expect(number).toBeVisible();

//     await user.press(nextButton);

//     const selectOne = await screen.findByTestId('OBS.select-one-inp');
//     expect(selectOne).toBeVisible();

//     await user.press(nextButton);

//     const selectMultiple = await screen.findByTestId('OBS.select-multiple-inp');
//     expect(selectMultiple).toBeVisible();

//     const doneButton = await screen.findByText('Done');
//     expect(doneButton).toBeVisible();

//     await user.press(doneButton);
//     expect(await screen.findByTestId('OBS.create-obs')).toBeVisible();
//   });
