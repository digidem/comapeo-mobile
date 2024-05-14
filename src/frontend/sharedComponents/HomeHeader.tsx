import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton} from './IconButton';
import {SyncIconCircle} from './icons';
import {GPSPill} from './GPSPill';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useQueryClient} from '@tanstack/react-query';
import {PROJECT_SETTINGS_KEY, useProject} from '../hooks/server/projects';

export const HomeHeader: FC<
  BottomTabHeaderProps & {openDrawer: () => void}
> = ({navigation, openDrawer}) => {
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);
  const queryClient = useQueryClient();
  const project = useProject();

  //This is to fix a bug. After a project is created, we invalidate the PROJECT_SETTINGS_KEY cache. This should refetch this query, and re-render any consuming component with the new name. But the drawer (which displays the prject name) is not responding to the cache being invalidated. I tested the hook in other components, and it is properly being invalidated. So on opening of the drawer im manually refetching which seems to fix the problem
  function prefetchProjectSettings() {
    queryClient.prefetchQuery({
      queryKey: [PROJECT_SETTINGS_KEY],
      queryFn: () => {
        return project.$getProjectSettings();
      },
    });
  }

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
        <SyncIconCircle />
      </IconButton>
      <GPSPill navigation={navigation} />
      <IconButton
        onPress={() => {
          prefetchProjectSettings();
          openDrawer();
        }}
        testID="observationListButton">
        <MaterialIcon name="menu" size={32} />
      </IconButton>
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
