import {useState} from 'react';
import {Calendar, type DateData} from 'react-native-calendars';
import {COMAPEO_BLUE} from '../../lib/styles';

export const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState<
    DateData['dateString'] | null
  >(null);
  return (
    <Calendar
      enableSwipeMonths
      onDayPress={date => {
        setSelectedDate(date.dateString);
      }}
      markedDates={
        selectedDate
          ? {
              [selectedDate]: {selected: true, selectedColor: COMAPEO_BLUE},
            }
          : undefined
      }
    />
  );
};
