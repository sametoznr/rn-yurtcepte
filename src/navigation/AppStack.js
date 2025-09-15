import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import ArizaScreen from '../screens/ArizaScreen'
import FoodListScreen from '../screens/FoodListScreen'
import GymScreen from '../screens/GymScreen'
import WashingScreen from '../screens/WashingScreen'
import OdaTransferi from '../screens/OdaTransferi'
import NotifactionScreen from '../screens/NotifactionScreen'
import YeniAriza from '../components/YeniAriza'
import IzinlerScreen from '../screens/IzinlerScreen'

const Stack = createNativeStackNavigator()

const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Ariza' component={ArizaScreen} />
            <Stack.Screen name='Yemek' component={FoodListScreen} />
            <Stack.Screen name='Izin' component={IzinlerScreen} />
            <Stack.Screen name='Spor' component={GymScreen} />
            <Stack.Screen name='Camasir' component={WashingScreen} />
            <Stack.Screen name='Oda' component={OdaTransferi} />
            <Stack.Screen name='Bildirim' component={NotifactionScreen} />
            <Stack.Screen name='YeniAriza' component={YeniAriza} />

        </Stack.Navigator>
    )
}

export default AppStack;