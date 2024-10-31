import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton} from './IconButton';
import {GPSPill} from './GPSPill';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {DrawerMenuIcon} from './icons/DrawerMenuIcon';
import SyncIconCircle from '../images/Sync.svg';

export const HomeHeader: FC<
  BottomTabHeaderProps & {openDrawer: () => void}
> = ({navigation, openDrawer}) => {
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);

  return (
    <View style={styles.header}>
      <LinearGradient
        style={styles.linearGradient}
        colors={['#0006', '#0000']}
      />
      <IconButton
        style={styles.leftButton}
        onPress={() => {
          navigation.navigate('Sync');
        }}>
        <SyncIconCircle testID="MAIN.sync-icon" />
      </IconButton>
      <GPSPill navigation={navigation} />
      <DrawerMenuIcon style={{marginRight: 20}} onPress={openDrawer} />
    </View>
  );
};

const createStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingTop: insets.top,
    },
    leftButton: {
      width: 60,
      height: 60,
    },
    linearGradient: {
      height: 60,
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      backgroundColor: 'transparent',
    },
  });
