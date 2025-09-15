import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Colors from '../components/Colors'
import { supabase } from '../../supabaseClient'
import { useAuth } from '../components/AuthContext'
import {
    ALERT_TYPE,
    Toast,
    AlertNotificationRoot,
    Dialog,
} from 'react-native-alert-notification';
import OncekiTalep from './OncekiTalep'

export default function OdaTransferi() {
    const [detay, setDetay] = useState('')
    const { user } = useAuth()

    const handleSubmit = async () => {
        if (!detay) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Hata',
                textBody: 'Tüm alanları doldurunuz.',
            });
            return
        }

        const { data: oTalep } = await supabase
            .from('odatransferi')
            .select('ogrId')

        if (oTalep && oTalep.some(item => item.ogrId === user.id)) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Hata',
                textBody: 'Güncel bir talebiniz bulunmaktadır. Yeni talep oluşturamazsınız.',
            })
            return
        }

        const { error: talepErr } = await supabase
            .from('odatransferi')
            .insert([{ detay, ogrId: user.id, durum: 'Onay bekliyor' }])

        if (talepErr) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Hata',
                textBody: `Talebiniz gönderilemedi. ${talepErr.message}`,
            })
            return
        }

        Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Başarılı',
            textBody: 'Başarıyla oda değişikliği talebinde bulundunuz.'
        })
        setDetay('')
    }

    return (
        <AlertNotificationRoot>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Oda Değişikliği Talebi Oluştur</Text>
                    <TextInput
                        placeholder="Eklemek istediğiniz açıklamayı giriniz"
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                        value={detay}
                        onChangeText={setDetay}
                    />
                    <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                        <Text style={styles.btnTxt}>Gönder</Text>
                    </TouchableOpacity>
                </View>

                <OncekiTalep />
            </View>
        </AlertNotificationRoot>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: Colors.background
    },
    card: {
        width: '100%',
        backgroundColor: Colors.surface,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 50,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12
    },
    input: {
        width: '100%',
        minHeight: 100,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        fontWeight: '400',
        backgroundColor: Colors.surface,
        textAlignVertical: 'top',
        marginBottom: 15
    },
    btn: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.info,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border
    },
    btnTxt: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.surface
    }
})
