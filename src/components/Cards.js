import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from './Colors'
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';




export default function Cards() {

    const navigation = useNavigation();

    const menuCard = [
        { icon: "silverware-fork-knife", title: "Günlük Menü", screen: "Yemek" },
        { icon: "bag-personal", title: "İzin Talebi", screen: "Izin" },
        { icon: "home-search", title: "Oda Değişikliği", screen: "Oda" },
        { icon: "tools", title: "Arıza Bildirimi", screen: "Ariza" },
        { icon: "washing-machine", title: "Çamaşırhane Rezervasyonu", screen: "Camasir" },
        { icon: "weight-lifter", title: "Spor Salonu Rezervasyonu", screen: "Spor" },
    ]

    const handlePress = (screen) => {
        if (screen) {
            navigation.navigate(screen)
        } else {
            console.log("error")
        }
    }

    return (
        <View style={styles.scrollCont}>
            <View style={styles.cardsGrid}>{
                menuCard.map((card, index) => (
                    <TouchableOpacity
                        style={styles.card}
                        key={index}
                        onPress={() => handlePress(card.screen)} >
                        <Icon source={card.icon} size={50} color={Colors.info} />
                        <Text style={styles.cardTitle}>{card.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    scrollCont: {
        paddingVertical: 20
    },
    card: {
        width: '48%',
        aspectRatio: 1, // Kare 
        backgroundColor: Colors.surface,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap', // yeni satıra geçme
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    cardTitle: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text
    }
})