import DateTimePickerModal from "react-native-modal-datetime-picker";
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import {
    ALERT_TYPE,
    Dialog,
    Toast,
    AlertNotificationRoot,
} from 'react-native-alert-notification';
import Colors from '../components/Colors'

export default function DataPicker({ onDateSelected, minDate = null, otherDate = null, otherDateLabel = '', label }) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const today = new Date();

    const showDatePicker = () => { setDatePickerVisibility(true); };

    const hideDatePicker = () => { setDatePickerVisibility(false); };

    const handleConfirm = (date) => {
        const formattedDate = date.toLocaleDateString()
        if (minDate && date < new Date(minDate)) {
            hideDatePicker();
            setTimeout(() => {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Hata',
                    textBody: `${label} bugünden önce olamaz.`,
                });
            }, 100);
            return;
        }
        setSelectedDate(formattedDate);
        hideDatePicker();
        if (onDateSelected) {
            onDateSelected(formattedDate)
        }

    };

    return (
        <View style={{
            marginVertical: 10,
            alignItems: 'center',
            padding: 10
        }}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity onPress={showDatePicker} style={styles.tarihBtn}>
                <Text style={styles.btnTxt} > {selectedDate ? selectedDate : "Seçiniz"}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                themeVariant={"light"}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    tarihBtn: {
        borderWidth: 1,
        width: 120,
        borderColor: Colors.border,
        backgroundColor: Colors.info,
        borderRadius: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnTxt: {
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    }
})