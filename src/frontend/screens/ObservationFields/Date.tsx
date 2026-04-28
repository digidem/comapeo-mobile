import {useState} from 'react';
import {Calendar, type DateData} from 'react-native-calendars';
import {COMAPEO_BLUE} from '../../lib/styles';

export const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState<
    DateData['dateString'] | null
  >(null);

  function handleDayPress(date: DateData) {
    if (selectedDate === date.dateString) {
      setSelectedDate(null);
      return;
    }
    setSelectedDate(date.dateString);
  }

  return (
    <Calendar
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
  );
};
