import {ReactNode} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {ViewStyleProp} from '../../sharedTypes';
import {WHITE} from '../../lib/styles';
import {useBottomPaddingWithSafeArea} from '../../hooks/useBottomPaddingWithSafeArea';
import {LoadingIndicator} from '../LoadingIndicator';

export type ScreenContentWithDockedButtonSharedProps = {
  children: ReactNode;
  dockContainerStyle?: Omit<
    ViewStyleProp,
    'paddingBottom' | 'alignItems' | 'gap' | 'flex' | 'paddingTop'
  >;
  contentContainerStyle?: Omit<ViewStyleProp, 'backgroundColor' | 'flex'>;
  testID?: string;
  backgroundColor?: string;
  topButton?: ReactNode;
  bottomButton: ReactNode;
  loading?: boolean;
};

/**
 *
 * DO NOT USE. Used for internal purposes. Use ScreenContentWithDock or
 */
export const ScreenContentWithDockedButtonInternal = ({
  children,
  contentContainerStyle,
  dockContainerStyle,
  bottomButton,
  topButton,
  backgroundColor = WHITE,
  loading,
  testID,
}: ScreenContentWithDockedButtonSharedProps) => {
  const paddingBottom = useBottomPaddingWithSafeArea();
  return (
    <View style={{backgroundColor, flex: 1}} testID={testID}>
      <ScrollView
        bounces={false}
        style={styles.scrollViewRoot}
        contentContainerStyle={[
          // these are general patterns, but can be overwritten when neccessary
          {
            paddingHorizontal: 20,
            paddingTop: 20,
            flexGrow: 1,
          },
          contentContainerStyle,
        ]}>
        {children}
      </ScrollView>
      <View
        style={[
          dockContainerStyle,
          //these intentionally cannot be overwritted as the spacing and padding is opinionated here
          {
            paddingBottom,
            flex: 0,
            alignItems: 'center',
            gap: 20,
            paddingTop: 20,
          },
        ]}>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            {topButton}
            {bottomButton}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewRoot: {flex: 1},
});
