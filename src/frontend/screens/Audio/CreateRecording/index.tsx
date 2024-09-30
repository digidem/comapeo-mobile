import React, {useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {WHITE} from '../../../lib/styles';

import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {CustomHeaderLeft} from '../../../sharedComponents/CustomHeaderLeft';

export function CreateRecording() {
  const navigation = useNavigationFromRoot();
  useEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <CustomHeaderLeft
          tintColor={props.tintColor}
          headerBackButtonProps={props}
        />
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.message}>Create Recording</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {flex: 1},
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    color: WHITE,
    fontSize: 20,
    textAlign: 'center',
  },
});
