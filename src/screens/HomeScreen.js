import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import { supabase } from '../../supabaseClient'
import Cards from '../components/Cards'
import { commonStyles } from '../css/commonStyles'
import Colors from '../components/Colors'
import { Icon } from 'react-native-paper'
import {
    ALERT_TYPE,
    Dialog,
    Toast,
    AlertNotificationRoot,
} from 'react-native-alert-notification';

export default function HomeScreen({ navigation }) {
    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
        } catch (error) {
            console.log(error.message)
        }
    }
    const [userName, setUserName] = useState("")
    const [izinGun, setIzinGun] = useState(0)
    const [title, setTitle] = useState("")
    const [userId, setUserId] = useState("")

    const fetchIzinler = async (currentUserId) => {
        if (!currentUserId) return
        try {
            const { data: izinler, error: gunErr } = await supabase
                .from('izinler')
                .select('izinbaslangic, izinbitis,durum')
                .eq('ogrId', currentUserId)

            if (gunErr) throw gunErr;
            const onayliIzinler = izinler.filter(izin => izin.durum === 'Onaylandı');
            const toplamIzin = onayliIzinler.reduce((toplam, izin) => {
                const baslangic = new Date(izin.izinbaslangic);
                const bitis = new Date(izin.izinbitis);
                const gunFarki = Math.floor((bitis - baslangic) / (1000 * 60 * 60 * 24)) + 1;
                return toplam + gunFarki;
            }, 0);

            setIzinGun(toplamIzin);
        } catch (gunErr) {
            console.error("İzin verisi çekilirken hata:", error.message)
        }
    }

    const fetchDuyuru = async () => {

        try {
            const { data: bildirim, error: bildErr } = await supabase
                .from('duyurular')
                .select('title')
                .order('id', { ascending: false })
                .limit(1)

            if (bildErr) throw bildErr;

            setTitle(bildirim[0]?.title)
        } catch (bildErr) {
            console.error("Duyuru çekilirken hata:", error.message)
        }
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (session && session.user) {
                    const currentUserId = session.user.id;
                    setUserId(currentUserId)


                    const { data: names, error: nameErr } = await supabase
                        .from('userler')
                        .select('adSoyad, userId')
                        .eq('userId', currentUserId)
                        .single();
                    if (nameErr) throw nameErr;
                    setUserName(names.adSoyad);

                    fetchIzinler(currentUserId);
                    fetchDuyuru();

                }
            } catch (error) {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Uyarı',
                    textBody: error.message,
                });

            }
        };

        getUser();

        const duyuruChannel = supabase.channel('public:duyurular')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'duyurular' },
                (payload) => {
                    fetchDuyuru();
                }
            ).subscribe();

        const izinChannel = supabase.channel('public:izinler')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'izinler' },
                (payload) => {
                    if (userId && (payload.new?.ogrId === userId || payload.old?.ogrId === userId)) {
                        fetchIzinler(userId);
                    }
                }
            ).subscribe();

        return () => {
            supabase.removeChannel(duyuruChannel);
            supabase.removeChannel(izinChannel);
        };
    }, [userId]);

    const kalanGun = Math.max(0, Math.floor(60 - izinGun))


    return (
        <AlertNotificationRoot>
            <View style={commonStyles.container}>


                <View style={styles.footer}>
                    <View>
                        <Text style={styles.footerTxt1}>Merhaba,</Text>
                        <Text style={styles.footerTxt2}>{userName}</Text>
                    </View>

                    <View>
                        <TouchableOpacity onPress={handleLogout}
                            style={styles.btn}>
                            <Icon source={"exit-to-app"} size={20} color={Colors.error} />
                            <Text style={styles.btnTxt}>Çıkış Yap</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bildirimCont}>
                    <TouchableOpacity
                        style={styles.bildirimBtn}
                        onPress={() => navigation.navigate('Bildirim')}>
                        <Icon source={"bell"} size={18} color={Colors.surface} />
                        <Text numberOfLines={1} style={styles.bildirimTxt}>{title} </Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.izincont}>

                    <View>
                        <Icon source={"account-clock"} size={40} color={'red'} />
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.footerTxt1}>Kalan İzin Hakkı</Text>
                        <Text style={styles.txt1}>{`${kalanGun} gün`}</Text>
                    </View>

                    <View style={{ width: 40 }} />
                </View>

                <Cards />
            </View >
        </AlertNotificationRoot>
    )
}


const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',

    },
    bildirimTxt: {
        color: Colors.surface,
        marginLeft: 5,
        fontWeight: '500',
        fontSize: 16
    },
    footer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 390,
        height: 50
    },
    izincont: {
        borderWidth: 1,
        height: 70,
        width: '95%',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: 'red',
        borderRadius: 10,
        backgroundColor: Colors.surface,
        paddingHorizontal: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    txt1: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center'
    },
    btnTxt: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.error,
    },
    bildirimCont: {
        width: '95%',
        height: 55,
        backgroundColor: Colors.info,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        justifyContent: 'center',
        elevation: 3, // Android için gölge
        shadowColor: '#000', // iOS için gölge
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    bildirimBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    footerTxt1: {
        color: Colors.textSecondary,
        fontSize: 20,
        fontWeight: '500',

    },
    footerTxt2: {
        color: Colors.text,
        fontSize: 22,
        fontWeight: '800',

    }

})