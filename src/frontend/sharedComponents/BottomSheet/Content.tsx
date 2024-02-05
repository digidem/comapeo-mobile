import * as React from 'react';
import {StyleSheet, TextStyle, View} from 'react-native';
import {TouchableHighlight} from '@gorhom/bottom-sheet';

import {LIGHT_BLUE, MAGENTA, COMAPEO_BLUE, RED, WHITE} from '../../lib/styles';
import {Button} from '../Button';
import {Text} from '../Text';
import {UIActivityIndicator} from 'react-native-indicators';

interface BaseActionButtonConfig {
  onPress: () => void;
  text: React.ReactNode;
  variation: 'filled' | 'outlined';
  icon?: React.ReactNode;
}

interface PrimaryActionButtonConfig extends BaseActionButtonConfig {
  dangerous?: boolean;
  variation: 'filled';
}

interface SecondaryActionButtonConfig extends BaseActionButtonConfig {
  variation: 'outlined';
}

type ActionButtonConfig =
  | PrimaryActionButtonConfig
  | SecondaryActionButtonConfig;

export interface Props extends React.PropsWithChildren<{}> {
  buttonConfigs: ActionButtonConfig[];
  description?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  loading?: boolean;
}

export const Content = ({
  children,
  icon,
  buttonConfigs,
  description,
  title,
  titleStyle,
  descriptionStyle,
  loading,
}: Props) => (
  <View style={styles.container}>
    <View>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.textContainer}>
        <Text style={[styles.title, styles.bold, titleStyle]}>{title}</Text>
        {description && (
          <Text style={[styles.description, descriptionStyle]}>
            {description}
          </Text>
        )}
      </View>
      {!!children && <View style={{flex: 1}}>{children}</View>}
    </View>
    {loading ? (
      <UIActivityIndicator size={30} style={{margin: 20}} />
    ) : (
      <View style={styles.buttonsContainer}>
        {buttonConfigs.map((config, index) => {
          return (
            <Button
              fullWidth
              key={index}
              TouchableComponent={props => (
                <TouchableHighlight
                  {...props}
                  underlayColor={
                    config.variation === 'outlined'
                      ? WHITE
                      : config.dangerous
                        ? RED
                        : LIGHT_BLUE
                  }
                />
              )}
              onPress={config.onPress}
              style={{
                backgroundColor:
                  config.variation === 'outlined'
                    ? WHITE
                    : config.dangerous
                      ? MAGENTA
                      : COMAPEO_BLUE,
                marginTop: index > 0 ? 20 : undefined,
              }}
              variant={
                config.variation === 'outlined' ? 'outlined' : undefined
              }>
              <View style={styles.buttonTextContainer}>
                {config.icon ? (
                  <View style={styles.buttonTextIconContainer}>
                    {config.icon}
                  </View>
                ) : null}
                <Text
                  style={[
                    styles.buttonText,
                    styles.bold,
                    {
                      color:
                        config.variation === 'outlined' ? COMAPEO_BLUE : WHITE,
                    },
                  ]}>
                  {config.text}
                </Text>
              </View>
            </Button>
          );
        })}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    padding: 20,
    paddingTop: 30,
  },
  iconContainer: {
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
  },
  description: {
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  buttonTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  buttonTextIconContainer: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 18,
  },
  bold: {fontWeight: '700'},
});
