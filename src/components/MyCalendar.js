import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

const primaryColor = '#1173d4';
const textColor = '#0d141b';
const white = '#fff';

// Türkçe lokal ayarlar
LocaleConfig.locales['tr'] = {
    monthNames: [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ],
    monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    dayNamesShort: ['Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'],
    today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

const MyCalendar = ({ onDayPress }) => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);

    const markedDates = {
        [selectedDate]: {
            selected: true,
            selectedColor: primaryColor,
            customStyles: {
                container: {
                    backgroundColor: primaryColor,
                    borderRadius: 20,
                    width: 36,
                    height: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                text: {
                    color: white,
                    fontWeight: 'bold',
                },
            }
        }
    };

    return (
        <View style={styles.calendarCard}>
            <Calendar
                theme={{
                    backgroundColor: white,
                    calendarBackground: white,
                    textSectionTitleColor: '#6B7280',
                    selectedDayBackgroundColor: primaryColor,
                    selectedDayTextColor: white,
                    todayTextColor: primaryColor,
                    dayTextColor: textColor,
                    textDisabledColor: '#D1D5DB',
                    selectedDotColor: white,
                    arrowColor: '#6B7280',
                    monthTextColor: textColor,
                    textDayFontWeight: '500',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: 'bold',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 12,
                }}
                current={today}
                minDate={today} // geçmişi seçtirme
                markedDates={markedDates}
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    if (onDayPress) onDayPress(day.dateString); // parent'a gönder
                }}
                firstDay={1}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    calendarCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: white,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
});

export default MyCalendar;
