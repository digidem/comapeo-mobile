import {useEffect, useRef, useState} from 'react';
import {Calendar, type DateData} from 'react-native-calendars';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import {BLACK, BLUE_GREY, COMAPEO_BLUE, NEW_DARK_GREY} from '../../lib/styles';
import IonIcon from '@react-native-vector-icons/ionicons';
import {defineMessages, useIntl} from 'react-intl';
import {Observation} from '@comapeo/schema';
import {isISODateString} from '../../sharedComponents/FormattedData';

const m = defineMessages({
  date: {
    id: '$1screens.obsDetail.date',
    defaultMessage: 'Date',
  },
});

type DatePickerProps = {
  tagValue?: Observation['tags'][number];
  updateTag: (newDate: string | null) => void;
};

// Converts a UTC ISO instant back to the local calendar day (YYYY-MM-DD),
// as opposed to slicing the ISO string, which reads the UTC day and is
// wrong for timezones ahead of UTC (e.g. Indonesia).
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 *
 * @description the `tagValue`can be any type (not a date), but this component will only update it to date
 *
 */
export const DatePicker = ({tagValue, updateTag}: DatePickerProps) => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const {formatMessage, formatDate} = useIntl();
  const valueAsDate = isISODateString(tagValue) ? tagValue : null;
  const hasSetDefaultDate = useRef(false);

  useEffect(() => {
    if (hasSetDefaultDate.current) return;
    hasSetDefaultDate.current = true;
    if (!valueAsDate) {
      const todayIso = new Date(
        toLocalDateString(new Date()) + 'T00:00:00',
      ).toISOString();
      updateTag(todayIso);
    }
  }, [valueAsDate, updateTag]);

  function handleDayPress(date: DateData) {
    // Appending T00:00:00 forces local midnight parsing; without it, date-only
    // strings are parsed as UTC midnight and display as the previous day in
    // timezones behind UTC.
    const dateAsIso = new Date(date.dateString + 'T00:00:00').toISOString();
    if (valueAsDate === dateAsIso) {
      // if user is pressing the same date it indicates they are unselecting that date
      updateTag(null);
      return;
    }
    updateTag(dateAsIso);
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        {valueAsDate && (
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>{formatMessage(m.date)}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.textInput}
          testID="OBS.DateInput"
          onPress={() => setCalendarVisible(val => !val)}>
          <Text style={valueAsDate ? styles.valueText : styles.placeholderText}>
            {valueAsDate
              ? formatDate(valueAsDate, {
                  dateStyle: 'medium',
                })
              : formatMessage(m.date)}
          </Text>
        </TouchableOpacity>
      </View>
      {calendarVisible && (
        <Calendar
          testID="FIELD.date-calendar"
          style={styles.calendarStyle}
          enableSwipeMonths
          maxDate={toLocalDateString(new Date())}
          renderArrow={direction => (
            <IonIcon
              name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
              size={20}
              color={NEW_DARK_GREY}
            />
          )}
          onDayPress={handleDayPress}
          markedDates={
            valueAsDate
              ? {
                  [toLocalDateString(new Date(valueAsDate))]: {
                    selected: true,
                    selectedColor: COMAPEO_BLUE,
                  },
                }
              : undefined
          }
        />
      )}
      <View
        onTouchEnd={() => {
          if (calendarVisible) setCalendarVisible(false);
        }}
        style={{height: '100%'}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    position: 'relative',
    marginTop: 20,
    padding: 20,
    flex: 1,
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    top: 8,
    left: 35,
    zIndex: 5,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Rubik',
    color: NEW_DARK_GREY,
  },

  textInput: {
    minHeight: 56,
    flex: 1,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 20,
    color: BLACK,
  },
  placeholderText: {
    fontSize: 20,
    color: BLUE_GREY,
  },
  calendarStyle: {
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    margin: 2,
  },
});
