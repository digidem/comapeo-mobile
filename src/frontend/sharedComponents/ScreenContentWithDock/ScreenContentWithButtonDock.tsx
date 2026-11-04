import {WHITE} from '../../lib/styles';
import {
  ScreenContentWithDockedButtonInternal,
  ScreenContentWithDockedButtonSharedProps,
} from './ScreenContentWithDockInternal';

/**
 *
 * @desc This is an opionated component and should only be used for screens with a header
 */
export const ScreenContentWithButtonDock = ({
  children,
  contentContainerStyle,
  dockContainerStyle,
  topButton,
  bottomButton,
  backgroundColor = WHITE,
  testID,
}: ScreenContentWithDockedButtonSharedProps) => {
  return (
    <ScreenContentWithDockedButtonInternal
      testID={testID}
      backgroundColor={backgroundColor}
      contentContainerStyle={[contentContainerStyle, {paddingTop: 20}]}
      dockContainerStyle={[dockContainerStyle]}
      topButton={topButton}
      bottomButton={bottomButton}>
      {children}
    </ScreenContentWithDockedButtonInternal>
  );
};
