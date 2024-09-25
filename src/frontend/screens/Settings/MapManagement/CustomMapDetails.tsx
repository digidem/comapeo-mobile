import React from 'react';
import {FormattedDate, defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {MEDIUM_GREY, RED, VERY_LIGHT_GREY} from '../../../lib/styles';
import {Text} from '../../../sharedComponents/Text';
import {bytesToMegabytes} from '../../../lib/bytesToMegabytes';

const m = defineMessages({
  mapNameColumn: {
    id: 'screens.Settings.MapManagement.MapsList.CustomMapDetails.mapNameColumn',
    defaultMessage: 'Map Name',
  },
  dateAddedColumn: {
    id: 'screens.Settings.MapManagement.MapsList.CustomMapDetails.dateAdded',
    defaultMessage: 'Date Added',
  },
  removeMap: {
    id: 'screens.Settings.MapManagement.MapsList.CustomMapDetails.removeMap',
    defaultMessage: 'Remove Map',
  },
  sizeInMegabytes: {
    id: 'screens.Settings.MapManagement.MapsList.CustomMapDetails.sizeInMegabytes',
    defaultMessage: '{value} MB',
  },
});

export function CustomMapDetails({
  dateAdded,
  name,
  onRemove,
  size,
}: {
  dateAdded: number;
  name: string;
  onRemove: () => void;
  size?: number;
}) {
  const {formatMessage: t} = useIntl();

  const calculatedSize = size ? bytesToMegabytes(size).toFixed(0) : undefined;
  const displayedSize =
    calculatedSize === undefined
      ? undefined
      : parseInt(calculatedSize, 10) < 1
        ? '<1'
        : calculatedSize;

  return (
    <View style={styles.rootContainer}>
      <View style={styles.columnHeadersContainer}>
        <Text style={styles.columnTitleText}>{t(m.mapNameColumn)}</Text>
        <Text style={styles.columnTitleText}>{t(m.dateAddedColumn)}</Text>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.cardRow}>
          <View style={styles.columnLeft}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.sizeText}>
              {displayedSize !== undefined &&
                t(m.sizeInMegabytes, {
                  value: displayedSize,
                })}
            </Text>
          </View>
          <View style={styles.columnRight}>
            <Text style={styles.dateAddedText}>
              <FormattedDate
                year="numeric"
                month="short"
                day="2-digit"
                value={dateAdded}
              />
            </Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <TouchableOpacity onPress={onRemove} hitSlop={20}>
            <Text style={styles.removeMapText}>{t(m.removeMap)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    gap: 12,
  },
  columnHeadersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 3,
    borderColor: VERY_LIGHT_GREY,
    borderWidth: 2,
    gap: 36,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnTitleText: {
    color: MEDIUM_GREY,
  },
  dateAddedText: {
    color: MEDIUM_GREY,
  },
  sizeText: {
    color: MEDIUM_GREY,
  },
  removeMapText: {
    fontWeight: 'bold',
    color: RED,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  columnLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  columnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
