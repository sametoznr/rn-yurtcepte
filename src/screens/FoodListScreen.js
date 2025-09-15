import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import {
    ALERT_TYPE,
    Dialog,
    Toast,
    AlertNotificationRoot,
} from 'react-native-alert-notification';
import Colors from '../components/Colors'
import { commonStyles } from '../css/commonStyles'

export default function FoodListScreen() {
    const [yemekListesi, setYemekListesi] = useState([])

    useEffect(() => {
        const getData = async () => {
            try {
                const { data: yemekList, error: yemekErr } = await supabase
                    .from('yemeklist')
                    .select('sabah, aksam, show_date ')
                    .order('show_date', { ascending: false })

                if (yemekErr) throw yemekErr
                setYemekListesi(yemekList)

            } catch (error) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Hata',
                    textBody: error.message,
                });
                return
            }
        }
        getData()
    }, [])

    const renderItem = ({ item }) => (
        <View style={styles.ListItem}>
            <View style={styles.cardCont}>
                <Text style={styles.dateText}>{item.show_date}</Text>
                <Text style={styles.cardTitle}>Kahvaltı:  </Text>
                <Text>{item.sabah}</Text>
            </View>
            <View style={styles.cardCont}>
                <Text style={styles.cardTitle}>Akşam yemeği: </Text>
                <Text>{item.aksam}</Text>
            </View>
        </View>

    )
    const listTitle = () => (
        <Text style={styles.text1}>Yemek Listesi</Text>

    )

    return (
        <AlertNotificationRoot>
            <View style={commonStyles.container}>
                <FlatList
                    data={yemekListesi}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
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
        width: 380
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
        textAlign: 'center'
    },
    cardCont: { marginBottom: 5 },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    }

})