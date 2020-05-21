import { Text, StyleSheet } from 'react-native';
import React from 'react';

export const BodyText = (props) => {
    return <Text style={{ ...styles.text, ...props.style }}>{props.children}</Text>;
};

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
    },
});
