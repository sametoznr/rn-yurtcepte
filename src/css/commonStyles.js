import { StyleSheet } from 'react-native';
import Colors from '../components/Colors';

export const commonStyles = StyleSheet.create({
    text1: {
        fontSize: 30,
        fontWeight: 800,
        color: Colors.text
    },
    text2: {
        fontSize: 20,
        fontWeight: 400, color: Colors.textSecondary
    },
    text3: {
        fontSize: 18,
        fontWeight: 700,
        color: Colors.text,
        marginBottom: 5
    },
    img: { width: 130, height: 130 },
    inputTxt: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 600,
        color: Colors.text
    },
    textCont: { paddingBottom: 30, alignItems: 'center' },
    btnTxt: {
        color: Colors.textSecondary,
        fontSize: 17,
        fontWeight: 500
    },
    btnTxt2: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: 600
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: Colors.background

    },
    formBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 125,
        borderRadius: 10
    }
})