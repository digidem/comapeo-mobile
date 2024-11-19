import React from 'react';
import {FormattedDate, defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {bytesToMegabytes} from '../../../lib/bytesToMegabytes';
import {
  BLACK,
  NEW_DARK_GREY,
  WARNING_RED,
  VERY_LIGHT_GREY,
} from '../../../lib/styles';
import {Loading} from '../../../sharedComponents/Loading';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';

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
  loading,
  name,
  onRemove,
  size,
}: {
  dateAdded: Date;
  loading?: boolean;
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
        <BodyText variant="smallMeta" style={styles.columnTitleText}>
          {t(m.mapNameColumn)}
        </BodyText>
        <BodyText variant="smallMeta" style={styles.columnTitleText}>
          {t(m.dateAddedColumn)}
        </BodyText>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.cardRow}>
          <View style={styles.columnLeft}>
            <HeaderText variant="header5">{name}</HeaderText>
            <BodyText variant="smallMeta" style={styles.sizeText}>
              {displayedSize !== undefined &&
                t(m.sizeInMegabytes, {
                  value: displayedSize,
                })}
            </BodyText>
          </View>
          <View style={styles.columnRight}>
            <BodyText variant="smallMeta" style={styles.dateAddedText}>
              <FormattedDate
                year="numeric"
                month="short"
                day="2-digit"
                value={dateAdded}
              />
            </BodyText>
          </View>
        </View>
        <View style={styles.cardRow}>
          <TouchableOpacity onPress={onRemove} hitSlop={20}>
            <BodyText variant="smallMeta" style={styles.removeMapText}>
              {t(m.removeMap)}
            </BodyText>
          </TouchableOpacity>
        </View>
        {loading && <LoadingOverlay />}
      </View>
    </View>
  );
}

function LoadingOverlay() {
  return (
    <View pointerEvents="none" style={styles.overlay}>
      <View style={[styles.overlay, {opacity: 0.1, backgroundColor: BLACK}]} />
      <Loading size={10} />
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
    color: NEW_DARK_GREY,
  },
  dateAddedText: {
    color: NEW_DARK_GREY,
  },
  sizeText: {
    color: NEW_DARK_GREY,
  },
  removeMapText: {
    fontWeight: 'bold',
    color: WARNING_RED,
  },
  columnLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  columnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
