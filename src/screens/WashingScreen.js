import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../components/AuthContext';
import CustomButton from '../components/CustomButton';
import Colors from '../components/Colors';
import MyCalendar from '../components/MyCalendar';
import {
    ALERT_TYPE,
    Dialog,
    Toast,
    AlertNotificationRoot,
} from 'react-native-alert-notification';

export default function WashingScreen() {
    const [secilenSaat, setSecilenSaat] = useState(null);
    const [tip, setTip] = useState(null);
    const [tarih, setTarih] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    const saatler = [
        { label: "09.00 - 10.00", value: "09:00:00" },
        { label: "10.00 - 11.00", value: "10:00:00" },
        { label: "12.00 - 13.00", value: "12:00:00" },
        { label: "13.00 - 14.00", value: "13:00:00" },
        { label: "14.00 - 15.00", value: "14:00:00" },
        { label: "15.00 - 16.00", value: "15:00:00" },
        { label: "16.00 - 17.00", value: "16:00:00" },
        { label: "17.00 - 18.00", value: "17:00:00" },
    ];

    async function handleReservation(type, date, time) {
        if (!type || !date || !time) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Uyarı',
                textBody: 'Lütfen tüm alanları doldurunuz.',
            });
            return
        }
        setLoading(true);

        try {
            const { data: mevcutRez, error: mevcutRezError } = await supabase
                .from('makinerezervasyon')
                .select(`
                    makineler ( tip )
                `)
                .eq('ogrId', user.id)
                .eq('tarih', date);

            if (mevcutRezError) throw mevcutRezError;

            const dbTip = type === "Çamaşır" ? "çamaşır" : "kurutma";
            const ayniTipRezVar = mevcutRez.some(rez => rez.makineler.tip === dbTip);

            if (ayniTipRezVar) {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Hata',
                    textBody: `Bu tarih için zaten bir "${type}" rezervasyonunuz bulunmaktadır.`,
                });
                setLoading(false);
                return;
            }
            const { data: makineNo, error } = await supabase.rpc('rezervasyon_olustur', {
                p_ogr_id: user.id,
                p_makine_tipi: dbTip,
                p_tarih: date,
                p_saat: time
            });

            if (error) throw error;
            if (makineNo) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Başarılı',
                    textBody: `Rezervasyonunuz başarıyla oluşturuldu! Makine No: ${makineNo}`,
                });
                setTarih(null);
                setSecilenSaat(null);
                setTip(null);
            } else {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Hata',
                    textBody: `Seçtiğiniz saatte boş ${type} makinesi bulunmamaktadır.`,
                });
            }

        } catch (err) {
            console.error("Rezervasyon hatası:", err.message);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Hata',
                textBody: "Rezervasyon sırasında bir hata oluştu. Lütfen tekrar deneyin.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertNotificationRoot>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ width: '90%' }}>
                    <MyCalendar
                        onDayPress={(date) => setTarih(date)}
                        markedDate={tarih}
                    />
                </View>

                <View style={styles.saatCont}>
                    <Text style={styles.sectionTitle}>Saat Seçiniz</Text>
                    <View style={styles.saatFooter}>
                        {saatler.map((saat) => (
                            <TouchableOpacity
                                key={saat.value}
                                style={[
                                    styles.timeSlotButton,
                                    secilenSaat === saat.value ? styles.selectedTimeSlot : styles.unselectedTimeSlot
                                ]}
                                onPress={() => setSecilenSaat(saat.value)}
                            >
                                <Text style={[
                                    styles.timeSlotText,
                                    secilenSaat === saat.value ? styles.selectedTimeText : styles.unselectedTimeText
                                ]}>
                                    {saat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Makine Tipini Seçiniz</Text>
                    <View style={styles.machineTypeContainer}>
                        {["Çamaşır", "Kurutma"].map((mTip) => (
                            <TouchableOpacity
                                key={mTip}
                                style={[styles.typeButton, tip === mTip ? styles.selectedType : styles.unselectedType]}
                                onPress={() => setTip(mTip)}
                            >
                                <Text style={[styles.typeButtonText, tip === mTip ? styles.selectedTypeText : styles.unselectedTypeText]}>
                                    {mTip}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <CustomButton
                    buttonTxt={"Rezervasyon Yap"}
                    onPress={() => handleReservation(tip, tarih, secilenSaat)}
                    disabled={loading}
                    style={styles.Btn}
                />
                {loading && <ActivityIndicator size="large" color={Colors.info} style={{ marginTop: 20 }} />}
            </ScrollView>
        </AlertNotificationRoot>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#f3f4f6',
    },
    saatCont: {
        width: '90%',
        marginTop: 20,
    },
    saatFooter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeSlotButton: {
        width: '48%',
        paddingVertical: 15,
        borderRadius: 8,
        marginVertical: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    unselectedTimeSlot: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    selectedTimeSlot: {
        backgroundColor: Colors.info,
        borderWidth: 1,
        borderColor: '#2563eb',
    },
    timeSlotText: { fontWeight: 'bold' },
    unselectedTimeText: { color: '#1f2937' },
    selectedTimeText: { color: '#fff' },
    sectionContainer: {
        width: "90%",
        marginTop: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#111827" },
    machineTypeContainer: { flexDirection: "row", justifyContent: "space-between" },
    typeButton: {
        flex: 1,
        paddingVertical: 20,
        marginHorizontal: 5,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    unselectedType: { backgroundColor: '#fff', borderColor: '#9ca3af' },
    selectedType: { backgroundColor: Colors.info, borderColor: '#2563eb' },
    typeButtonText: { fontWeight: 'bold' },
    unselectedTypeText: { color: '#1f2937' },
    selectedTypeText: { color: '#fff' },
    Btn: {
        margin: 15,
        borderWidth: 1,
        backgroundColor: Colors.info,
        borderColor: Colors.border,
        borderRadius: 10,
        width: 360,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
