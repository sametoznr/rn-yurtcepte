import { FlatList, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../components/Colors'
import { supabase } from '../../supabaseClient'
import { useAuth } from '../components/AuthContext'

export default function ArizaScreen({ navigation }) {
    const [arizaCek, setArizaCek] = useState([])
    const { user } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                const { data: ariza, error: arizaErr } = await supabase
                    .from('ariza')
                    .select('*')
                    .eq('ogrId', user.id)
                    .order('created_at', { ascending: false });

                if (arizaErr) throw arizaErr;
                setArizaCek(ariza)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [user])

    const getStatusStyle = (durum) => {
        if (durum === 'İşleme alındı') return styles.durumIslem;
        if (durum === 'Çözüldü') return styles.durumCozuldu;
    }

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{item.tur}</Text>
                <View style={[styles.durumCont, getStatusStyle(item.durum)]}>
                    <Text style={styles.durumTxt}>{item.durum}</Text>
                </View>
            </View>
            <Text style={styles.content}>{item.aciklama}</Text>
            <Text style={styles.date}>{item.tarih}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.bildirBtn} onPress={() => navigation.navigate('YeniAriza')}>
                <Text style={styles.btnTxt}>+ Yeni Arıza Bildir</Text>
            </TouchableOpacity>

            <FlatList
                style={styles.listWrapper}
                data={arizaCek}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>Daha önce hiç arıza bildiriminde bulunmadınız.</Text>}
                ListHeaderComponent={<Text style={styles.sectionTitle}>Önceki Talepleriniz</Text>}
            />
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
    },

    bildirBtn: {
        backgroundColor: Colors.text,
        width: '90%',
        height: 50,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listWrapper: {
        width: '90%',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: Colors.text,
    },
    card: {
        backgroundColor: Colors.surface,
        borderWidth: 1.5,
        borderColor: Colors.border,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        flex: 1,
    },
    content: {
        fontSize: 15,
        marginBottom: 12,
        lineHeight: 22,
    },
    date: {
        textAlign: 'right',
        fontSize: 14,
        opacity: 0.7,
    },
    durumCont: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
    },
    durumIslem: { backgroundColor: Colors.gold },
    durumCozuldu: { backgroundColor: Colors.success },
    durumTxt: { color: Colors.surface, fontSize: 14, fontWeight: 'bold' },
    emptyText: {
        fontSize: 17,
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 40,
        paddingHorizontal: 20,
    },
    btnTxt: {
        color: 'white',
        fontWeight: '700',
        fontSize: 20
    },
});