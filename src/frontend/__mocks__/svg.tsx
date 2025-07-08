import {View} from 'react-native';

export default ({testID}: Readonly<{testID?: string}>) => (
  <View testID={testID} />
);
