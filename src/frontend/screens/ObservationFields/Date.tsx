import {useState} from 'react';
import {Calendar, type DateData} from 'react-native-calendars';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import {BLACK, BLUE_GREY, COMAPEO_BLUE, NEW_DARK_GREY} from '../../lib/styles';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  date: {
    id: 'screens.obsDetail.date',
    defaultMessage: 'Date',
  },
});

export const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState<
    DateData['dateString'] | null
  >(null);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const {formatMessage, formatDate} = useIntl();

  function handleDayPress(date: DateData) {
    if (selectedDate === date.dateString) {
      setSelectedDate(null);
      return;
    }
    setSelectedDate(date.dateString);
  }

  return (
    <>
      <View style={styles.container}>
        {selectedDate && (
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>{formatMessage(m.date)}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.textInput}
          testID="OBS.DateInput"
          onPress={() => setCalendarVisible(val => !val)}>
          <Text
            style={selectedDate ? styles.valueText : styles.placeholderText}>
            {selectedDate
              ? //formatDate(selectedDate, {dateStyle: 'medium'})
                selectedDate
              : ''}
          </Text>
        </TouchableOpacity>
      </View>
      {calendarVisible && (
        <Calendar
          style={styles.calendarStyle}
          enableSwipeMonths
          onDayPress={handleDayPress}
          markedDates={
            selectedDate
              ? {
                  [selectedDate]: {selected: true, selectedColor: COMAPEO_BLUE},
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
