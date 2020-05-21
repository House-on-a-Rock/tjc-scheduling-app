import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export const CustomInput = (props) => {
    return (
        <View>
            <TextInput
                style={{ ...styles.input, ...props.style }}
                keyboardType={props.keyboardType}
                value={props.value}
                onChangeText={props.onChangeText}
                secureTextEntry={props.secureTextEntry}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '100%',
        height: 40,
        fontSize: 17,
    },
});
