import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from './Colors'
import { commonStyles } from '../css/commonStyles'
import { supabase } from '../../supabaseClient'
import { Picker } from '@react-native-picker/picker'
import { useAuth } from './AuthContext'
import {
    ALERT_TYPE,
    Toast,
    AlertNotificationRoot,
} from 'react-native-alert-notification';


export default function YeniAriza() {
    const [tur, setTur] = useState('')
    const [content, setContent] = useState('')
    const [odaNo, setodaNo] = useState('')
    const { user } = useAuth()

    useEffect(() => {
        const fetchOdaNo = async () => {
            try {
                const { data, error } = await supabase
                    .from('userler')
                    .select('odaNo')
                    .eq('userId', user.id)
                    .single()
                if (error) throw error;

                setodaNo(data?.odaNo || '')
            } catch (error) {
                console.log("Oda numarası yüklenirken hata oluştu: ", error.message)
            }
        }
        fetchOdaNo()
    }, [user])

    const handleKayit = async () => {
        if (!tur || !content || !odaNo) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Hata',
                textBody: 'Tüm alanları doldurunuz.',
            });
            return
        }
        try {
            const { error } = await supabase
                .from('ariza')
                .insert([
                    {
                        ogrId: user?.id,
                        tur: tur,
                        durum: 'İşleme alındı',
                        aciklama: content,
                        odaNo: odaNo,
                        tarih: new Date().toISOString().slice(0, 10),
                    }
                ])

            if (error) throw error;

            setContent('')
            setTur('')
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Başarılı',
                textBody: 'Arıza kaydınız alındı.',
            });

        } catch (error) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Hata',
                textBody: error.message,
            });
        }
    }

    return (
        <AlertNotificationRoot>
            <KeyboardAvoidingView
                style={commonStyles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Text style={commonStyles.text1}>Arıza Kayıt</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Tür seçiniz:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={tur}
                            onValueChange={(itemValue) => setTur(itemValue)}>
                            <Picker.Item label="Seçiniz..." value="" />
                            <Picker.Item label="Elektrik" value="elektrik" />
                            <Picker.Item label="Su" value="su" />
                            <Picker.Item label="Mobilya" value="mobilya" />
                            <Picker.Item label="Ortak Alan" value="ortak alan" />
                            <Picker.Item label="Diğer" value="diğer" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Açıklama:</Text>
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        style={styles.input}
                        numberOfLines={4}
                        multiline={true}
                        placeholder='Açıklama giriniz...'
                    />

                    <TouchableOpacity style={styles.btn} onPress={handleKayit}>
                        <Text style={styles.btnTxt}>Gönder</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </AlertNotificationRoot>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        padding: 15,
        width: '95%',
        marginTop: 15,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 6,
        marginTop: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
    },
    input: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        borderColor: Colors.border,
        fontSize: 15,
        fontWeight: '400',
        backgroundColor: Colors.surface,
        textAlignVertical: 'top',
        marginBottom: 15,
        minHeight: 100,
    },
    btn: {
        backgroundColor: Colors.info,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnTxt: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.surface,
    },
})
