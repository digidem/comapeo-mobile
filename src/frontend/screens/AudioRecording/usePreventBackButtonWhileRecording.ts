import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

export function usePreventBackButtonWhileRecording({
  shouldPrevent,
}: {
  shouldPrevent: boolean;
}) {
  const {setOptions} = useNavigationFromRoot();

  if (shouldPrevent) {
    setOptions({headerShown: false});
  }

  useEffect(() => {
    if (shouldPrevent) {
      const onBackPress = () => {
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => {
        backHandler.remove();
      };
    }
  }, [shouldPrevent]);
}
