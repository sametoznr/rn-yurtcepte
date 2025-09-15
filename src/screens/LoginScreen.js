import { StyleSheet, Text, View, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import SignupScreen from './SignupScreen'
import Colors from '../components/Colors'
import { commonStyles } from '../css/commonStyles'
import { supabase } from '../../supabaseClient'
import {
    ALERT_TYPE,
    Dialog,
    Toast,
    AlertNotificationRoot,
} from 'react-native-alert-notification';




export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const translateAuthError = (errorMessage) => {
        const errorMap = {
            "Invalid login credentials": "Girdiğiniz e-posta veya şifre hatalı.",
            "User already registered": "Bu e-posta adresi zaten kullanılıyor. Lütfen başka bir e-posta adresi deneyin.",
            "Password should be at least 6 characters": "Şifre en az 6 karakterden oluşmalıdır.",
            "User not found": "Kullanıcı bulunamadı. Lütfen bilgilerinizi kontrol edin.",
        };

        return errorMap[errorMessage] || errorMessage;
    };

    const handleLogin = async () => {
        if (email === '' || password === '') {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Uyarı',
                textBody: 'Lütfen tüm alanları doldurunuz.',
            });
            return
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) {
            const translatedErrorMessage = translateAuthError(error.message);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Giriş Hatası',
                textBody: translatedErrorMessage,
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
                        <Text style={commonStyles.text3}>Hesabınıza giriş yapınız</Text>
                    </View>

                    <View style={styles.card}>


                        <View style={styles.inputCont}>
                            <Text style={commonStyles.inputTxt}>Email Adresi</Text>
                            <CustomInput placeholder="Email adresinizi giriniz"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View style={styles.inputCont}>
                            <Text style={commonStyles.inputTxt}>Şifre</Text>
                            <CustomInput placeholder="Şifrenizi giriniz"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword} />
                        </View>


                        <CustomButton buttonTxt={"Giriş Yap"} onPress={handleLogin} style={commonStyles.formBtn} />

                        <View style={{ marginTop: 5 }}>

                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={commonStyles.btnTxt} >Hesabın yok mu? <Text style={commonStyles.btnTxt2}>Kayıt Ol</Text> </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </AlertNotificationRoot>

    )
}

const styles = StyleSheet.create({
    card: {
        width: 350,
        height: 350,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputCont: {
        width: '85%',
        marginBottom: 20,

    },


})