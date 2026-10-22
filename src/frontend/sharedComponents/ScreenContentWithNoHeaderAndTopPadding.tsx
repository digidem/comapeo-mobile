import {ReactNode, type PropsWithChildren} from 'react';

import {ViewStyleProp} from '../sharedTypes';
import {useCustomSafeAreaInsets} from '../hooks/useCustomSafeAreaInsets';
import {WHITE} from '../lib/styles';
import {ScreenContentWithDock} from './ScreenContentWithDock';

export const ScreenContentWithNoHeaderAndTopPadding = ({
  children,
  contentContainerStyle,
  dockContainerStyle,
  dockContent,
  backgroundColor = WHITE,
  testID,
}: PropsWithChildren<{
  dockContent: ReactNode;
  dockContainerStyle?: ViewStyleProp;
  contentContainerStyle?: ViewStyleProp;
  testID?: string;
  backgroundColor?: string;
}>) => {
  const {top} = useCustomSafeAreaInsets();
  return (
    <ScreenContentWithDock
      dockContent={dockContent}
      dockContainerStyle={dockContainerStyle}
      backgroundColor={backgroundColor}
      testID={testID}
      contentContainerStyle={{...contentContainerStyle, paddingTop: top + 80}}>
      {children}
    </ScreenContentWithDock>
  );
};
