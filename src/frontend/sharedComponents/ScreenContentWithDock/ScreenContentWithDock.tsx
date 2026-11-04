import {useBottomPaddingWithSafeArea} from '../../hooks/useBottomPaddingWithSafeArea';
import {WHITE} from '../../lib/styles';
import {
  ScreenContentWithDockInternal,
  SharedScreenContentProps,
} from './ScreenContentWithDockInternal';

/**
 *
 * @desc This is an opionated component and should only be used for screens with a header
 */
export const ScreenContentWithDock = ({
  children,
  contentContainerStyle,
  dockContainerStyle,
  dockContent,
  backgroundColor = WHITE,
  testID,
}: SharedScreenContentProps) => {
  const paddingBottom = useBottomPaddingWithSafeArea();
  return (
    <ScreenContentWithDockInternal
      testID={testID}
      backgroundColor={backgroundColor}
      contentContainerStyle={[contentContainerStyle, {paddingTop: 20}]}
      dockContainerStyle={[dockContainerStyle, {paddingBottom}]}
      dockContent={dockContent}>
      {children}
    </ScreenContentWithDockInternal>
  );
};
