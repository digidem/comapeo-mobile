import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WHITE} from '../../lib/styles';
import {
  ScreenContentWithDockedButtonInternal,
  ScreenContentWithDockedButtonSharedProps,
} from './ScreenContentWithDockInternal';

/**
 *
 * @desc This is an opionated component and should only be used for screens no navigation header.
 */
export const ScreenContentWithButtonDockNoHeader = ({
  children,
  contentContainerStyle,
  dockContainerStyle,
  topButton,
  bottomButton,
  backgroundColor = WHITE,
  loading,
  testID,
}: ScreenContentWithDockedButtonSharedProps & {
  contentContainerStyle?: Omit<
    ScreenContentWithDockedButtonSharedProps['contentContainerStyle'],
    'topPadding'
  >;
}) => {
  const {top} = useSafeAreaInsets();
  return (
    <ScreenContentWithDockedButtonInternal
      loading={loading}
      testID={testID}
      backgroundColor={backgroundColor}
      contentContainerStyle={[contentContainerStyle, {paddingTop: top + 80}]}
      dockContainerStyle={dockContainerStyle}
      topButton={topButton}
      bottomButton={bottomButton}>
      {children}
    </ScreenContentWithDockedButtonInternal>
  );
};
