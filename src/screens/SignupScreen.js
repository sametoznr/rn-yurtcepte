import { StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import Colors from '../components/Colors'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import { commonStyles } from '../css/commonStyles'
import { supabase } from '../../supabaseClient'
import {
    ALERT_TYPE,
    Dialog,
    Toast,
    AlertNotificationRoot,
} from 'react-native-alert-notification';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [tcNo, setTcNo] = useState("")

    const translateAuthError = (errorMessage) => {
        const errorMap = {
            "User already registered": "Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.",
            "Password should be at least 6 characters": "Şifre en az 6 karakterden oluşmalıdır.",
            "Auth rate limit exceeded": "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.",
            "Invalid email or password": "Geçersiz e-posta veya şifre formatı.",
        };
        return errorMap[errorMessage] || errorMessage;
    };

    const handleSignUp = async () => {
        if (email === '' || tcNo === '' || password === '' || confirmPassword === '') {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Uyarı',
                textBody: 'Lütfen tüm alanları doldurunuz.'
            })
            return
        }
        if (password !== confirmPassword) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Uyarı',
                textBody: 'Şifreler uyuşmuyor.'
            })
            return
        }
        if (tcNo.length !== 11) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Uyarı',
                textBody: 'TC kimlik numarası 11 haneli olmalıdır.'
            })
            return
        }
        try {
            const { data: tcData, error: tcError } = await supabase
                .from('userler')
                .select('id, tc_kimlik, aktifMi')
                .eq('tc_kimlik', tcNo)

            if (tcError) throw tcError;

            if (!tcData || tcData.length === 0) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Kayıt Hatası',
                    textBody: 'Girilen TC kimlik numarası sisteme kayıtlı değil lütfen yönetici ile iletişime geçiniz.',
                    button: 'Tamam',
                })
                return
            }
            const studentRecord = tcData[0]

            if (studentRecord.aktifMi) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Kayıt Hatası',
                    textBody: 'Girilen TC kimlik numrası ile zaten aktif bir hesap bulunmaktadır.',
                    button: 'Tamam'
                })
                return
            }


            const { data: userData, error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
            })
            if (signUpError) throw signUpError;

            const uid = userData.user.id

            const { error: updateError } = await supabase
                .from('userler')
                .update({
                    aktifMi: true,
                    email: email,
                    userId: uid
                })
                .eq('id', studentRecord.id)
            if (updateError) throw updateError;

            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Başarılı!',
                textBody: 'Hesabınız başarıyla oluşturuldu.Giriş yapabilirsiniz.',
                button: 'Tamam',
            })


        } catch (error) {
            const translatedMessage = translateAuthError(error.message);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'İşlem Hatası',
                textBody: translatedMessage,
                button: 'Tamam',
            });
        }
    }

    return (
        <AlertNotificationRoot>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={commonStyles.container}>
                    <View style={commonStyles.textCont}>
                        <Image source={require('../../assets/logo.png')} style={commonStyles.img} />
                        <Text style={commonStyles.text1}>Yurt Cepte</Text>
                        <Text style={commonStyles.text2}>Kredi ve Yurtlar Kurumu</Text>
                        <Text style={commonStyles.text3}>Kayıt olunuz</Text>
                    </View>

                    <View style={styles.card}>

                        <View style={styles.inputCont}>
                            <Text style={commonStyles.inputTxt}>TC Kimlik Numarası</Text>
                            <CustomInput placeholder={'Tc Kimlik numaranızı giriniz'}
                                value={tcNo}
                                onChangeText={setTcNo} />
                        </View>
                        <View style={styles.inputCont}>
                            <Text style={commonStyles.inputTxt}>Email Adresi</Text>
                            <CustomInput placeholder={'Email adresinizi giriniz'}
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <View style={styles.inputCont}>
                            <Text style={commonStyles.inputTxt}>Şifre</Text>
                            <CustomInput placeholder={'Şifrenizi giriniz'}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        <View style={styles.inputCont}>
                            <Text style={commonStyles.inputTxt}>Şifrenizi tekrarlayınız</Text>
                            <CustomInput placeholder={'Şifrenizi doğrulayınız'}
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                        <CustomButton buttonTxt={'Kayıt Ol'} onPress={handleSignUp} style={commonStyles.formBtn} />

                        <View style={{ marginTop: 5 }}>

                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={commonStyles.btnTxt} >Zaten hesabın var mı? <Text style={commonStyles.btnTxt2}>Giriş yap</Text> </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </AlertNotificationRoot>
    )
}

const styles = StyleSheet.create({
    inputCont: {
        width: '80%',
        marginBottom: 20,
    },
    card: {
        width: 360,
        height: 500,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

})