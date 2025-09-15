import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from './Colors'


export default function CustomButton({ buttonTxt, onPress, style }) {
    return (

        <TouchableOpacity style={style} onPress={onPress}>
            <Text style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'white'
            }}>
                {buttonTxt}</Text>
        </TouchableOpacity>


    )
}

const styles = StyleSheet.create({})