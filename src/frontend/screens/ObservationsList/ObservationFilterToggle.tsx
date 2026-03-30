import * as React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {
  useObservationFilterState,
  useObservationFilterActions,
} from '../../contexts/ObservationFilterContext';
import {BLUE_GREY, COMAPEO_BLUE, NEW_DARK_GREY, WHITE} from '../../lib/styles';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  all: {
    id: 'screens.ObservationsList.filter.all',
    defaultMessage: 'All',
  },
  justYou: {
    id: 'screens.ObservationsList.filter.justYou',
    defaultMessage: 'Just You',
  },
});

const ACTIVE_COLOR = COMAPEO_BLUE;
const INACTIVE_COLOR = NEW_DARK_GREY;

export function ObservationFilterToggle() {
  const {formatMessage} = useIntl();
  const filterMode = useObservationFilterState(state => state.filterMode);
  const {setFilterMode} = useObservationFilterActions();

  const isAllActive = filterMode === 'all';
  const isMineActive = filterMode === 'mine';

  return (
    <View style={styles.container} testID="OBS.filter-toggle">
      <View style={styles.filterUI}>
        <TouchableOpacity
          style={[
            styles.leftSide,
            isAllActive && styles.activeButton,
            !isAllActive && styles.inactiveButton,
          ]}
          onPress={() => setFilterMode('all')}
          accessibilityLabel={formatMessage(m.all)}
          accessibilityRole="button"
          accessibilityState={{selected: isAllActive}}
          testID={
            isAllActive ? 'OBS.filter-all-active' : 'OBS.filter-all-inactive'
          }>
          <MaterialIcon
            color={isAllActive ? ACTIVE_COLOR : INACTIVE_COLOR}
            size={27}
            name="people"
          />
          <HeaderText
            variant="header6"
            style={{
              color: isAllActive ? ACTIVE_COLOR : INACTIVE_COLOR,
            }}>
            {formatMessage(m.all)}
          </HeaderText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.rightSide,
            isMineActive && styles.activeButton,
            !isMineActive && styles.inactiveButton,
          ]}
          onPress={() => setFilterMode('mine')}
          accessibilityLabel={formatMessage(m.justYou)}
          testID={
            isMineActive ? 'OBS.filter-mine-active' : 'OBS.filter-mine-inactive'
          }>
          <MaterialIcon
            color={isMineActive ? ACTIVE_COLOR : INACTIVE_COLOR}
            size={27}
            name="person"
          />
          <HeaderText
            variant="header6"
            style={{
              color: isMineActive ? ACTIVE_COLOR : INACTIVE_COLOR,
            }}>
            {formatMessage(m.justYou)}
          </HeaderText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: BLUE_GREY,
  },
  filterUI: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    flex: 1,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    gap: 10,
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderRightWidth: 0.5,
  },
  rightSide: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    gap: 10,
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderLeftWidth: 0.5,
  },
  activeButton: {
    backgroundColor: WHITE,
  },
  inactiveButton: {
    backgroundColor: 'rgba(237, 237, 237, 0.5)',
  },
});
