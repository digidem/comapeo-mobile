import * as React from 'react';
import {StyleSheet, TextStyle, ScrollView, View} from 'react-native';
import {TouchableHighlight} from '@gorhom/bottom-sheet';
import {UIActivityIndicator} from 'react-native-indicators';

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

type ActionButtonConfig =
  | PrimaryActionButtonConfig
  | SecondaryActionButtonConfig;

export interface Props extends React.PropsWithChildren {
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
    <View style={styles.infoContainer}>
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
        <ScrollView style={styles.scrollView}>{children}</ScrollView>
      ) : (
        <ScrollView style={styles.scrollView}>
          {/* <View style={{backgroundColor: 'cyan', height: 400}} /> */}
        </ScrollView>
      )}
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
                        config.variation === 'outlined' ? COMAPEO_BLUE : WHITE,
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

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between'},
  infoContainer: {flex: 1, gap: 20, paddingTop: 20},
  iconContainer: {alignItems: 'center', justifyContent: 'center'},
  textContainer: {gap: 20, paddingHorizontal: 20},
  title: {textAlign: 'center', fontSize: 24},
  scrollView: {flex: 1},
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
