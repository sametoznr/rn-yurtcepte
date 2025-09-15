import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import Colors from '../components/Colors'
import {
    ALERT_TYPE,
    Dialog,
    Toast,
    AlertNotificationRoot,
} from 'react-native-alert-notification';
import { commonStyles } from '../css/commonStyles';

export default function NotifactionScreen() {

    const [bildirimCek, setBildirimCek] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: bildirimListesi, error: bildirimErr } = await supabase
                    .from('duyurular')
                    .select('title, show_date, content')
                    .order('show_date', { ascending: false })

                if (bildirimErr) throw bildirimErr
                setBildirimCek(bildirimListesi)
            } catch (error) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Hata',
                    textBody: error.message,
                });
                return
            }
        }
        fetchData()
    }, [])

    const renderItem = ({ item }) => (
        <View style={styles.ListItem}>
            <View style={styles.cardCont}>
                <Text style={styles.cardTitle}>{item.title}</Text>
            </View>

            <View style={styles.cardCont}>
                <Text style={{ color: Colors.textSecondary }}>{item.show_date}</Text>
            </View>

            <View style={styles.cardCont}>
                <Text>{item.content}</Text>
            </View>
        </View>
    )

    const listTitle = () => (
        <Text style={styles.text1}>Duyurular</Text>
    )

    return (
        <AlertNotificationRoot>
            <View style={commonStyles.container}>
                <FlatList
                    data={bildirimCek}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={listTitle}
                />
            </View>
        </AlertNotificationRoot>
    )
}

const styles = StyleSheet.create({
    text1: {
        fontSize: 30,
        fontWeight: 800,
        color: Colors.text,
        margin: 30,
        textAlign: 'center'
    },
    ListItem: {
        backgroundColor: Colors.surface,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        width: 370
    },
    cardCont: {
        marginBottom: 5
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    }
})