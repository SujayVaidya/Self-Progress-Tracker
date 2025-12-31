import { ChevronDown } from 'lucide-react-native';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  CalendarProvider,
  ExpandableCalendar,
  ExpandableCalendar as ExpandableCalendarType,
} from 'react-native-calendars';
import { styles } from '../styles';

interface WeeklyCalendarStripProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const WeeklyCalendarStrip: React.FC<WeeklyCalendarStripProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [isExpanded, setIsExpanded] = useState(false);
  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);
  const rotation = useRef(new Animated.Value(0));

  // Update currentDate when selectedDate prop changes
  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#007AFF',
      selectedTextColor: '#FFFFFF',
    },
  };

  const handleDateSelect = useCallback((date: string) => {
    setCurrentDate(date);
    onDateSelect(date);
  }, [onDateSelect]);

  const toggleCalendarExpansion = useCallback(() => {
    const isOpen = calendarRef.current?.toggleCalendarPosition();
    setIsExpanded(isOpen ?? false);
    Animated.timing(rotation.current, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  const onCalendarToggled = useCallback((isOpen: boolean) => {
    setIsExpanded(isOpen);
    rotation.current.setValue(isOpen ? 1 : 0);
  }, []);

  const renderHeader = useCallback(
    (date?: any) => {
      const rotationInDegrees = rotation.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      });

      const dateObj = date ? moment(date.toString()) : moment(currentDate);
      const monthYear = dateObj.format('MMMM YYYY');

      return (
        <TouchableOpacity
          style={calendarStyles.header}
          onPress={toggleCalendarExpansion}
          activeOpacity={0.7}
        >
          <Text style={calendarStyles.headerTitle}>{monthYear}</Text>
          <Animated.View style={{ transform: [{ rotate: rotationInDegrees }] }}>
            <ChevronDown size={20} color="#AAAAAA" />
          </Animated.View>
        </TouchableOpacity>
      );
    },
    [currentDate, toggleCalendarExpansion]
  );

  const calendarTheme = {
    backgroundColor: '#121212',
    calendarBackground: '#1E1E1E',
    textSectionTitleColor: '#AAAAAA',
    selectedDayBackgroundColor: '#007AFF',
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: '#007AFF',
    dayTextColor: '#FFFFFF',
    textDisabledColor: '#555555',
    dotColor: '#007AFF',
    selectedDotColor: '#FFFFFF',
    arrowColor: '#007AFF',
    monthTextColor: '#FFFFFF',
    textDayFontWeight: '400' as const,
    textMonthFontWeight: '600' as const,
    textDayHeaderFontWeight: '600' as const,
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
    'stylesheet.calendar.header': {
      week: {
        marginTop: 5,
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 0,
        paddingLeft: 0,
        paddingRight: 0,
        marginHorizontal: 0,
      },
    },
    'stylesheet.calendar.main': {
      container: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingHorizontal: 0,
      },
      week: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    'stylesheet.day.basic': {
      base: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
      },
      today: {
        backgroundColor: 'transparent',
      },
      todayText: {
        color: '#007AFF',
        fontWeight: '600',
      },
    },
  };

  const onDateChanged = useCallback((date: string, updateSource: string) => {
    // Only update from explicit day press - ignore all other automatic updates
    // This prevents the calendar from jumping back to today when scrolling
    if (date && updateSource === 'DAY_PRESS' && date !== currentDate) {
      handleDateSelect(date);
    }
    // Ignore all other update sources to prevent unwanted date changes
  }, [currentDate, handleDateSelect]);

  return (
    <View style={[styles.calendarContainer, calendarStyles.container]}>
      <CalendarProvider
        date={currentDate}
        onDateChanged={onDateChanged}
        showTodayButton={false}
        disabledOpacity={0.6}
      >
        <View style={calendarStyles.calendarWrapper}>
          <ExpandableCalendar
            ref={calendarRef}
            onCalendarToggled={onCalendarToggled}
            renderHeader={renderHeader}
            firstDay={1}
            markedDates={markedDates}
            onDayPress={(day) => {
              // Directly handle day press - this is the primary way to select dates
              const selectedDateString = day.dateString;
              if (selectedDateString && selectedDateString !== currentDate) {
                handleDateSelect(selectedDateString);
              }
            }}
            theme={calendarTheme}
            style={calendarStyles.expandableCalendar}
            calendarStyle={calendarStyles.calendarStyle}
            initialPosition={ExpandableCalendarType.positions.CLOSED}
            hideKnob={false}
            disablePan={true}
            closeOnDayPress={true}
            allowShadow={true}
            current={currentDate}
            hideExtraDays={isExpanded}
            disableWeekScroll={false}
            numberOfDays={7}
            // Force showing all days in week view to match day headers
            showScrollIndicator={false}
            calendarWidth={340}
            calendarHeight={100}
          />
        </View>
      </CalendarProvider>
    </View>
  );
};

const calendarStyles = StyleSheet.create({
  container: {
    minHeight: 100,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  calendarWrapper: {
    width: '100%',
    minHeight: 100,
    overflow: 'visible',
  },
  expandableCalendar: {
    borderWidth: 0,
    width: '100%',
    minHeight: 100,
    overflow: 'visible',
  },
  calendarStyle: {
    paddingLeft: 12,
    paddingRight: 0,
    paddingHorizontal: 0,
    overflow: 'visible',
  },
});
