import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {createDrawerNavigator} from 'react-navigation';



class HomeScreen extends Component {

    render() {
        return (
            <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>This is the home Screen</Text>
            </View>
        );
    }
}


export default HomeScreen;