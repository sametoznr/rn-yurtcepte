import { StyleSheet, Text, View, TextInput, FlatList, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Colors from '../components/Colors';
import { useAuth } from '../components/AuthContext';
import DataPicker from '../components/DataPicker';
import {
    ALERT_TYPE,
    Dialog,
    Toast,
    AlertNotificationRoot,
} from 'react-native-alert-notification';
import CustomButton from '../components/CustomButton';
import { commonStyles } from '../css/commonStyles';

export default function IzinlerScreen() {
    const [aciklama, setAciklama] = useState('');
    const [baslangic, setBaslangic] = useState('');
    const [bitis, setBitis] = useState('');
    const [talep, setTalep] = useState([]);

    const { user } = useAuth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fetchData = async () => {
        if (!user?.id) return;
        const { data, error } = await supabase
            .from('izinler')
            .select('durum,izinbaslangic,izinbitis,izindetay')
            .eq('ogrId', user.id)
            .order('izinbaslangic', { ascending: false });

        if (!error) setTalep(data);
        if (error) console.error("Veri çekme hatası:", error.message);
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleSubmit = async () => {
        if (!baslangic || !bitis || !aciklama) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Hata',
                textBody: 'Tüm alanları doldurunuz.',
            });
            return;
        }

        if (new Date(bitis) <= new Date(baslangic)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Hata',
                textBody: 'Bitiş tarihi, başlangıç tarihinden önce olamaz.',
            });
            return;
        }

        const bekleyenTalep = talep.some(t => t.durum === 'Onay bekliyor');
        if (bekleyenTalep) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Hata',
                textBody: 'Onay bekleyen bir talebiniz bulunmaktadır. Yeni talep oluşturmak için eski talebinizin durumunun değişmesi gerekmektedir.',
            });
            return;
        }

        try {
            const { error } = await supabase.from('izinler').insert([
                {
                    ogrId: user.id,
                    durum: 'Onay bekliyor',
                    izinbaslangic: baslangic,
                    izinbitis: bitis,
                    izindetay: aciklama,
                }
            ]);

            if (error) throw error;

            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Başarılı',
                textBody: `${baslangic} - ${bitis} tarihleri arasındaki izin talebiniz başarıyla iletilmiştir.`,
            });

            setAciklama('');
            setBaslangic('');
            setBitis('');
            fetchData();

        } catch (error) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Hata',
                textBody: error.message,
            });
        }
    };

    const getStatusStyle = (durum) => {
        if (durum === 'Onay bekliyor') return styles.durumBek;
        if (durum === 'Reddedildi') return styles.durumRed;
        if (durum === 'Onaylandı') return styles.durumOnay;
        return {};
    };

    const renderItem = ({ item }) => (
        <View style={styles.cardItem}>
            <View style={[styles.durumCont, getStatusStyle(item.durum)]}>
                <Text style={styles.durumTxt}>{item.durum}</Text>
            </View>
            <Text style={styles.detay}>{item.izindetay}</Text>
            <View style={styles.dateCont}>
                <Text style={styles.detay}>{item.izinbaslangic} / </Text>
                <Text style={styles.detay}>{item.izinbitis}</Text>
            </View>
        </View>
    );

    return (
        <AlertNotificationRoot>
            <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>İzin Talebi</Text>
                    <View style={styles.pickerCont}>
                        <DataPicker
                            label="Başlangıç tarihi"
                            selectedDate={baslangic}
                            minDate={today}
                            onDateSelected={(date) => setBaslangic(date)}
                            style={{ flex: 1, marginRight: 8 }}
                        />
                        <DataPicker
                            label="Bitiş tarihi"
                            minDate={baslangic ? new Date(baslangic) : today}
                            selectedDate={bitis}
                            onDateSelected={(date) => setBitis(date)}
                            style={{ flex: 1 }}
                        />
                    </View>
                    <TextInput
                        placeholder="İzin nedeninizi açıklayınız"
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                        value={aciklama}
                        onChangeText={setAciklama}
                    />
                    <CustomButton buttonTxt={"Gönder"} style={styles.submitBtn} onPress={handleSubmit} />
                </View>
                <View style={styles.talepCont}>
                    <Text style={styles.sectionTitle}>Önceki Talepleriniz</Text>
                    <FlatList
                        data={talep}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Daha önce izin talebinde bulunmadınız.</Text>
                        }
                    />
                </View>
            </ScrollView>
        </AlertNotificationRoot>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    contentContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    pickerCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        minHeight: 100,
        borderWidth: 2,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        fontWeight: '400',
        backgroundColor: Colors.surface,
        textAlignVertical: 'top',
        marginBottom: 15
    },
    submitBtn: {
        backgroundColor: Colors.info,
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    talepCont: {
        width: '90%',
        marginTop: 20,
    },
    cardItem: {
        backgroundColor: Colors.surface,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    durumCont: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    durumTxt: {
        fontWeight: 'bold',
        color: Colors.surface,
        fontSize: 14,
    },
    durumOnay: { backgroundColor: Colors.success },
    durumRed: { backgroundColor: Colors.error },
    durumBek: { backgroundColor: Colors.gold },
    detay: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 4,
    },
    dateCont: {
        flexDirection: 'row',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 20,
    },
});