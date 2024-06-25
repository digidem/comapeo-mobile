import * as React from 'react';
import {StyleSheet, TextStyle, ScrollView, View} from 'react-native';
import {TouchableHighlight} from '@gorhom/bottom-sheet';
import {useDimensions} from '@react-native-community/hooks';
import {UIActivityIndicator} from 'react-native-indicators';

import {LIGHT_BLUE, MAGENTA, COMAPEO_BLUE, RED, WHITE} from '../../lib/styles';
import {Button} from '../Button';
import {Text} from '../Text';
import {useBottomSheetModalProperties} from './BottomSheetModalPropertiesContext';

const MINIMUM_SHEET_HEIGHT = 400;
const LOADING_INDICATOR_HEIGHT = 40;

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
  icon,
  loading,
  title,
  titleStyle,
}: Props) => {
  const {window} = useDimensions();
  const {fullScreen} = useBottomSheetModalProperties();

  return (
    <View
      style={[
        styles.container,
        fullScreen ? {height: '100%'} : {maxHeight: window.height * 0.8},
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
          <ScrollView
            style={fullScreen ? {flex: 1} : {maxHeight: window.height * 0.2}}>
            {children}
          </ScrollView>
        ) : null}
      </View>
      <View style={styles.buttonsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <UIActivityIndicator size={LOADING_INDICATOR_HEIGHT} />
          </View>
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
    minHeight: MINIMUM_SHEET_HEIGHT,
  },
  infoContainer: {gap: 20, paddingTop: 20},
  iconContainer: {alignItems: 'center', justifyContent: 'center'},
  textContainer: {gap: 20, paddingHorizontal: 20},
  title: {textAlign: 'center', fontSize: 24},
  description: {fontSize: 20, textAlign: 'center'},
  loadingContainer: {height: LOADING_INDICATOR_HEIGHT},
  buttonsContainer: {gap: 20, padding: 20},
  buttonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonText: {fontSize: 18},
  bold: {fontWeight: '700'},
});
