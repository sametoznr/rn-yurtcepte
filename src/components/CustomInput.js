import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native';
import Colors from './Colors';


export default function CustomInput({ value, secureTextEntry = false, placeholder, onChangeText, numberOfLines, multiline }) {
    return (
        <View>

            <TextInput
                value={value}
                secureTextEntry={secureTextEntry}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={styles.input}
                numberOfLines={numberOfLines}
                multiline={multiline}
            />

        </View>

    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 2,
        borderRadius: 6,
        height: '45',
        borderColor: Colors.border,
        fontSize: 15,
        fontWeight: 500,
        backgroundColor: Colors.surface,

    }
})
