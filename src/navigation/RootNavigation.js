import React, { useState, useEffect } from 'react'
import AuthStack from './AuthStack'
import AppStack from './AppStack'
import { NavigationContainer } from '@react-navigation/native'
import { View } from 'react-native'
import { supabase } from '../../supabaseClient'
import { ActivityIndicator, MD2Colors } from 'react-native-paper';





export default function RootNavigation() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )
        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator animating={true} color={MD2Colors.red800} />
            </View>
        )
    }

    return (
        <NavigationContainer>
            {
                user ? <AppStack /> : <AuthStack />
            }

        </NavigationContainer>
    )


}


