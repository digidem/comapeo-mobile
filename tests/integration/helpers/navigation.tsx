import {AppNavigator} from '../../../src/frontend/AppNavigator';

type MockedAppNavigatorProps = {
  permissionAsked?: boolean;
};

export const MockedAppNavigator = ({
  permissionAsked = true,
}: MockedAppNavigatorProps = {}) => {
  return (
    <AppNavigator
      permissionAsked={permissionAsked}
      navigationIntegration={undefined}
    />
  );
};
