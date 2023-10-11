import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceNamingList} from '../../Navigation/ScreenGroups/DeviceNamingScreens';
import CoMapeoText from '../../images/CoMapeoText.svg';
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {LIGHT_GREY, MEDIUM_GREY, RED} from '../../lib/styles';
import {Text} from '../../sharedComponents/Text';
import {Button} from '../../sharedComponents/Button';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  header: {
    id: 'screens.DeviceNaming.header',
    defaultMessage: 'Add a name for your device',
  },
  description: {
    id: 'screens.DeviceNaming.description',
    defaultMessage:
      "Guidance on how to choose a name and what it's for. You can edit this later",
  },
  addName: {
    id: 'screens.DeviceNaming.addName',
    defaultMessage: 'Add Name',
  },
});

export const DeviceNaming = ({
  navigation,
}: NativeStackScreenProps<DeviceNamingList, 'DeviceNaming'>) => {
  const [name, setName] = React.useState('');
  const [errorTimeout, setErrorTimeout] = useErrorTimeout();
  const invalidName = name.length === 0 || name.length > 60;
  const {formatMessage: t} = useIntl();

  function setNameWithValidation(nameValue: string) {
    if (nameValue.length > 60) {
      setErrorTimeout();
      return;
    }
    setName(nameValue);
  }

  function handleAddNamePress() {
    if (invalidName) {
      setErrorTimeout();
      return;
    }

    navigation.navigate('Success', {deviceName: name});
  }
  return (
    <KeyboardAvoidingView style={{width: '100%', height: '100%'}}>
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}>
        <View>
          <CoMapeoText style={{alignSelf: 'center'}} />

          <Text style={{marginTop: 20}}>{t(m.header)}</Text>
          <TextInput
            style={[
              styles.textInput,
              {borderColor: !errorTimeout ? LIGHT_GREY : RED},
            ]}
            value={name}
            onChangeText={setNameWithValidation}
            placeholder="Device Name"
          />
          <Text
            style={{
              alignSelf: 'flex-end',
              color: errorTimeout ? RED : MEDIUM_GREY,
            }}>
            {`${name.length}/60`}
          </Text>
          <View style={styles.greyBox}>
            <Text>{t(m.description)}</Text>
          </View>
        </View>

        <Button fullWidth onPress={handleAddNamePress}>
          {t(m.addName)}
        </Button>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

function useErrorTimeout() {
  const [errorTimeout, setErrorTimeout] = React.useState(false);
  const timer = React.useRef<NodeJS.Timeout | undefined>();

  React.useEffect(() => {
    if (errorTimeout && !timer.current) {
      timer.current = setTimeout(() => {
        setErrorTimeout(false);
        timer.current = undefined;
      }, 1500);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }
    };
  }, [errorTimeout]);

  return [
    errorTimeout,
    () => setErrorTimeout(prevVal => (!prevVal ? true : prevVal)),
  ] as const;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 20,
    paddingTop: 80,
    justifyContent: 'space-between',
  },
  textInput: {
    borderWidth: 1.5,
    borderRadius: 5,
    fontSize: 16,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  greyBox: {
    borderRadius: 10,
    backgroundColor: LIGHT_GREY,
    marginTop: 20,
    padding: 20,
    fontSize: 20,
    marginBottom: 40,
  },
});
