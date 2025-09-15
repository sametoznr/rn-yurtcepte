import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import Colors from '../components/Colors'
import { useAuth } from '../components/AuthContext'

export default function OncekiTalep() {
    const [veri, setVeri] = useState([])
    const [odaNo, setOdaNo] = useState([])
    const { user } = useAuth()





    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('odatransferi')
                .select('*')
                .eq('ogrId', user.id)

            if (!error) setVeri(data)

            const { data: odaNo, error: odaErr } = await supabase
                .from('userler')
                .select('odaNo')
                .eq('userId', user.id)
                .single()

            if (!odaErr) setOdaNo(odaNo.odaNo)
        }
        fetchData()
    }, [user])

    const getStatusStyle = (durum) => {
        if (durum === 'Onay bekliyor') return styles.durumBek
        if (durum === 'Reddedildi') return styles.durumRed
        if (durum === 'Onaylandı') return styles.durumOnay
        return {}
    }

    const oda = odaNo

    const renderItem = ({ item, odaNo }) => (
        <View style={styles.card}>
            <View style={[styles.durumCont, getStatusStyle(item.durum)]}>
                <Text style={styles.durumTxt}>{item.durum}</Text>
            </View>
            <Text style={styles.content}>{item.detay}</Text>
            <View style={{ flex: 1, alignItems: 'flex-end', }}>
                <Text style={{ fontWeight: 'bold' }}>Oda No: {oda}</Text>
            </View>
        </View>
    )

    return (
        <View style={{ width: '100%' }}>
            <Text style={styles.sectionTitle}>Önceki Talebiniz</Text>
            <FlatList
                data={veri}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Daha önce oda değişikliği talebinde bulunmadınız.</Text>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    card: {
        backgroundColor: Colors.surface,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12
    },
    durumCont: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8
    },
    durumTxt: {
        fontWeight: 'bold',
        color: Colors.surface,
        fontSize: 14
    },
    durumOnay: { backgroundColor: Colors.success },
    durumRed: { backgroundColor: Colors.error },
    durumBek: { backgroundColor: Colors.gold },
    content: {
        fontSize: 15,
        fontWeight: '400'
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 20
    }
})
