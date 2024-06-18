import * as React from 'react';
import {
  StyleSheet,
  TextStyle,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import {TouchableHighlight} from '@gorhom/bottom-sheet';
import {UIActivityIndicator} from 'react-native-indicators';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {LIGHT_BLUE, MAGENTA, COMAPEO_BLUE, RED, WHITE} from '../../lib/styles';
import {Button} from '../Button';
import {Text} from '../Text';

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

export type ActionButtonConfig =
  | PrimaryActionButtonConfig
  | SecondaryActionButtonConfig;

export interface Props extends React.PropsWithChildren {
  buttonConfigs: ActionButtonConfig[];
  description?: React.ReactNode;
  descriptionStyle?: TextStyle;
  fullScreen?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  title: React.ReactNode;
  titleStyle?: TextStyle;
}

export const Content = ({
  buttonConfigs,
  children,
  description,
  descriptionStyle,
  fullScreen,
  icon,
  loading,
  title,
  titleStyle,
}: Props) => {
  const {top: insetTop} = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        fullScreen
          ? {height: '100%', paddingTop: insetTop}
          : {maxHeight: Dimensions.get('window').height * 0.75},
      ]}>
      <View style={[styles.infoContainer, fullScreen && {flex: 1}]}>
        {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
        <View style={styles.textContainer}>
          <Text style={[styles.title, styles.bold, titleStyle]}>{title}</Text>
          {description ? (
            <Text style={[styles.description, descriptionStyle]}>
              {description}
            </Text>
          ) : null}
        </View>
        {children ? (
          <ScrollView style={fullScreen ? {flex: 1} : {maxHeight: 300}}>
            {children}
          </ScrollView>
        ) : null}
      </View>
      <View style={styles.buttonsContainer}>
        {loading ? (
          <UIActivityIndicator />
        ) : (
          buttonConfigs.map((config, index) => {
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
                }}
                variant={
                  config.variation === 'outlined' ? 'outlined' : undefined
                }>
                <View style={styles.buttonTextContainer}>
                  {config.icon ? <View>{config.icon}</View> : null}
                  <Text
                    style={[
                      styles.buttonText,
                      styles.bold,
                      {
                        color:
                          config.variation === 'outlined'
                            ? COMAPEO_BLUE
                            : WHITE,
                      },
                    ]}>
                    {config.text}
                  </Text>
                </View>
              </Button>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    minHeight: 400,
  },
  infoContainer: {
    gap: 20,
    paddingTop: 20,
  },
  iconContainer: {alignItems: 'center', justifyContent: 'center'},
  textContainer: {gap: 20, paddingHorizontal: 20},
  title: {textAlign: 'center', fontSize: 24},
  buttonsContainer: {gap: 20, padding: 20},
  description: {fontSize: 20, textAlign: 'center'},
  buttonTextContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  buttonText: {fontSize: 18},
  bold: {fontWeight: '700'},
});
