import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export const stackOptions = (props) => {
    return {
        headerLeft: () => (
            <Ionicons
                name="ios-menu"
                size={35}
                onPress={() => {
                    props.navigation.toggleDrawer();
                }}
                style={{ paddingLeft: 20, paddingBottom: Platform.OS === 'ios' ? 20 : 0 }}
            />
        ),
    };
};
