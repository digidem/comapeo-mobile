import {useState} from 'react';
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

/**
 *
 * @description the `tagValue`can be any type (not a date), but this component will only update it to date
 *
 */
export const DatePicker = ({tagValue, updateTag}: DatePickerProps) => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const {formatMessage, formatDate} = useIntl();
  const valueAsDate = isISODateString(tagValue) ? tagValue : null;

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
    <>
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
          style={styles.calendarStyle}
          enableSwipeMonths
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
                  [valueAsDate.slice(0, 10)]: {
                    selected: true,
                    selectedColor: COMAPEO_BLUE,
                  },
                }
              : undefined
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    position: 'relative',
    marginTop: 20,
    padding: 20,
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
