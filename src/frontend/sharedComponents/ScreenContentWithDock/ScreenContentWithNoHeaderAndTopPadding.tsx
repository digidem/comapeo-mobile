import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBottomPaddingWithSafeArea} from '../../hooks/useBottomPaddingWithSafeArea';
import {WHITE} from '../../lib/styles';
import {
  ScreenContentWithDockedButtonInternal,
  ScreenContentWithDockedButtonSharedProps,
} from './ScreenContentWithDockInternal';

/**
 *
 * @desc This is an opionated component and should only be used for screens no navigation header.
 */
export const ScreenContentWithNoHeaderAndTopPadding = ({
  children,
  contentContainerStyle,
  dockContainerStyle,
  dockContent,
  backgroundColor = WHITE,
  testID,
}: ScreenContentWithDockedButtonSharedProps) => {
  const paddingBottom = useBottomPaddingWithSafeArea();
  const {top} = useSafeAreaInsets();
  return (
    <ScreenContentWithDockedButtonInternal
      testID={testID}
      backgroundColor={backgroundColor}
      contentContainerStyle={[contentContainerStyle, {paddingTop: top + 80}]}
      dockContainerStyle={[dockContainerStyle, {paddingBottom}]}
      dockContent={dockContent}>
      {children}
    </ScreenContentWithDockedButtonInternal>
  );
};
