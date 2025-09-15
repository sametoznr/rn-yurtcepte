import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import {
    ALERT_TYPE,
    Dialog,
    Toast,
    AlertNotificationRoot,
} from 'react-native-alert-notification';
import Colors from '../components/Colors'
import { commonStyles } from '../css/commonStyles'
import { supabase } from '../../supabaseClient';
import { useAuth } from "../components/AuthContext";


export default function GymScreen() {
    const [secilenSaat, setSecilenSaat] = useState("09:00");
    const bugun = new Date().toISOString().split("T")[0];
    const { user } = useAuth()

    const handleRez = async () => {
        try {
            const formattedSaat = secilenSaat.replace(".", ":") + ":00";
            const { data: mevcut, error: err1 } = await supabase
                .from('sporrezervasyon')
                .select('*')
                .eq('ogrId', user.id)
                .eq('tarih', bugun)

            if (err1) throw err1;
            if ((mevcut || []).length > 0) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Hata',
                    textBody: 'Aynı gün içerisinde sadece 1 rezervasyon yapabilirsiniz!',
                });
                return
            }
            const { data: seans, error: err2 } = await supabase
                .from('sporrezervasyon')
                .select('*')
                .eq('tarih', bugun)
                .eq('saat', formattedSaat)

            if (err2) throw err2;
            if ((seans || []).length >= 10) {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Hata',
                    textBody: 'Bu seans dolmuştur lütfen farklı bir seans seçiniz.',
                });
                return
            }

            const { error: insertErr } = await supabase
                .from('sporrezervasyon')
                .insert([
                    {
                        ogrId: user.id,
                        tarih: bugun,
                        saat: formattedSaat,
                    }
                ])
            if (insertErr) throw insertErr

            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Başarılı',
                textBody: ` Spor salonu rezervasyonunuz saat ${secilenSaat} için oluşturulmuştur. Seans süresi toplam 1 saattir. Lütfen zamanında katılım sağlayınız.`,
            });
            return
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <AlertNotificationRoot>
            <View style={commonStyles.container}>
                <Text style={commonStyles.text1}>Kurallar</Text>
                <Text style={styles.text3}>Her seans 1 saattir </Text>
                <Text style={styles.text3}>Aynı gün içerisinde sadece tek rezervasyon yapılabilir </Text>
                <Text style={styles.text3}> Rezervasyona katılım sağlamayanlar aynı gün içersinde farklı bir rezervasyon oluşturamaz </Text>
                <Text style={commonStyles.text3}>Bugün için seçili saat: {secilenSaat}</Text>

                {["09.00", "10.00", "11.00", "13.00", "14.00", "15.00", "16.00", "17.00", "18.00", "19.00"].map((saat) => (
                    <TouchableOpacity
                        key={saat}
                        onPress={() => setSecilenSaat(saat)}
                        style={{
                            padding: 10,
                            margin: 5,
                            backgroundColor: secilenSaat === saat ? "green" : Colors.primary,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: "white" }}>{saat}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    onPress={handleRez}
                    style={{
                        marginTop: 20,
                        padding: 15,
                        backgroundColor: Colors.info,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Rezervasyon Yap</Text>
                </TouchableOpacity>
            </View>
        </AlertNotificationRoot>
    )
}

const styles = StyleSheet.create({
    text3: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 700,
        color: Colors.textSecondary,
        margin: 5
    }
})