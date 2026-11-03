import {ReactNode, type PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {ViewStyleProp} from '../../sharedTypes';
import {useBottomPaddingWithSafeArea} from '../../hooks/useBottomPaddingWithSafeArea';
import {WHITE} from '../../lib/styles';

export const ScreenContentWithDock = ({
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
  const paddingBottom = useBottomPaddingWithSafeArea();
  return (
    <View style={{backgroundColor, flex: 1}} testID={testID}>
      <ScrollView
        bounces={false}
        style={styles.scrollViewRoot}
        contentContainerStyle={[{paddingTop: 20}, contentContainerStyle]}>
        {children}
      </ScrollView>
      <View
        style={[
          styles.dockedContentContainer,
          {paddingBottom},
          dockContainerStyle,
        ]}>
        {dockContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewRoot: {flex: 1},
  dockedContentContainer: {
    flex: 0,
    alignItems: 'center',
  },
});
