import {ReactNode, type PropsWithChildren} from 'react';

import {ViewStyleProp} from '../sharedTypes';
import {usePaddingWithSafeArea} from '../hooks/usePaddingWithSafeArea';
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
  const {top} = usePaddingWithSafeArea();
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
