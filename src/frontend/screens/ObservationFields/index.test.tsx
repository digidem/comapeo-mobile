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
      await fireEvent.changeText(textInput, 'hello');
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
      // Deliberately passing a non-string to test how the field handles bad input.
      await fireEvent.changeText(textInput, null as unknown as string);

      expect(textInput).toHaveDisplayValue('');
    });

    test('renders empty when tagValue is not a string', async () => {
      const user = userEvent.setup();
      await navigateToTextField(user);
      const textInput = await screen.findByTestId('OBS.text-inp');
      // Deliberately passing a non-string to test how the field handles bad input.
      await fireEvent.changeText(textInput, {foo: 'bar'} as unknown as string);

      expect(textInput).toHaveDisplayValue('');
    });

    test('calls updateTag with empty string when cleared', async () => {
      const user = userEvent.setup();
      await navigateToTextField(user);
      const textInput = await screen.findByTestId('OBS.text-inp');
      await fireEvent.changeText(textInput, 'some text');
      expect(textInput).toHaveDisplayValue('some text');
      await fireEvent.changeText(textInput, '');

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
      await fireEvent.changeText(numberInput, '1.23');
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
      await fireEvent.changeText(numberInput, '-');
      expect(numberInput).toHaveDisplayValue('-');
      await fireEvent.changeText(numberInput, '-08');
      expect(numberInput).toHaveDisplayValue('-8');
      await fireEvent.changeText(numberInput, '1.2.34');
      expect(numberInput).toHaveDisplayValue('1.234');
      await fireEvent.changeText(numberInput, '-0');
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
      const optionExpected = await screen.findByText('Expected');
      await user.press(optionExpected);
      const inputExpected = await screen.findByTestId(
        'OBS.select-one-inp-Expected',
      );
      expect(inputExpected).toBeChecked();
      const inputUnusual = await screen.findByTestId(
        'OBS.select-one-inp-Unusual',
      );
      expect(inputUnusual).not.toBeChecked();
      const optionUnusual = await screen.findByText('Unusual');
      await user.press(optionUnusual);
      expect(inputExpected).not.toBeChecked();
      expect(inputUnusual).toBeChecked();
    });
  });

  describe('Select Multiple', () => {
    const integrationSetup = setupIntegrationTest();

    async function navigateToSelectMultiple(
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
      await user.press(await screen.findByText('Next'));
    }

    test('expects select one to be visible and is able to select', async () => {
      const user = userEvent.setup();
      await navigateToSelectMultiple(user);
      const optionHistory = await screen.findByText('History');

      await user.press(optionHistory);
      const inputHistory = await screen.findByTestId(
        'OBS.select-multiple-inp-History',
      );
      const inputMythology = await screen.findByTestId(
        'OBS.select-multiple-inp-Mythology',
      );
      expect(inputHistory).toBeSelected();
      expect(inputMythology).not.toBeSelected();

      const optionMythology = await screen.findByText('Mythology');
      await user.press(optionMythology);

      //expect both to still be selected
      expect(inputHistory).toBeSelected();
      expect(inputMythology).toBeSelected();
    });
  });

  describe('navigates in and out of the observation fields', () => {
    const integrationSetup = setupIntegrationTest();

    async function navigateToObservationDetails(
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

    test('correct back button behaviour', async () => {
      const user = userEvent.setup();
      await navigateToObservationDetails(user);
      // first details screen
      expect(await screen.findByText('Field test details')).toBeVisible();
      const backHeaderButton = await screen.findByTestId(
        'MAIN.header-back-btn',
      );
      await user.press(backHeaderButton);
      //should go back to observation create screen
      const createObservationScreen =
        await screen.findByTestId('OBS.create-obs');
      expect(createObservationScreen).toBeOnTheScreen();

      //second detail screen
      const detailsButton = await screen.findByText('Details');
      await user.press(detailsButton);
      await user.press(await screen.findByText('Next'));
      expect(await screen.findByText('Measurement Value')).toBeVisible();

      //should go back to first detail screen
      await user.press(await screen.findByTestId('MAIN.header-back-btn'));
      expect(await screen.findByText('Field test details')).toBeVisible();

      //third detail screen
      await user.press(await screen.findByText('Next'));
      await user.press(await screen.findByText('Next'));
      expect(await screen.findByText('Conditions')).toBeVisible();

      //should go back to second detail screen
      await user.press(await screen.findByTestId('MAIN.header-back-btn'));
      expect(await screen.findByText('Measurement Value')).toBeVisible();

      //4th detail screen
      await user.press(await screen.findByText('Next'));
      await user.press(await screen.findByText('Next'));
      expect(await screen.findByText('Cultural activity')).toBeVisible();

      //should go back to 3rd detal
      await user.press(await screen.findByTestId('MAIN.header-back-btn'));
      expect(await screen.findByText('Conditions')).toBeVisible();

      //go back to 4th detail screen
      await user.press(await screen.findByText('Next'));
      const doneButton = await screen.findByText('Done');
      expect(doneButton).toBeVisible();

      //should navigate back to create observation screen when done clicked
      await user.press(doneButton);
      expect(await screen.findByTestId('OBS.create-obs')).toBeVisible();
    });
  });
});
