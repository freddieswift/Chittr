import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';
class chittr extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerBar}>
                    <View style={styles.userPhoto}/>
                    <Text style={styles.chittrHeaderText}>Chittr</Text>
                    <View style={styles.userPhoto} />
                </View>
            </View>
                
            

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'stretch'
    },

    headerBar: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: 'palevioletred',
        alignItems: 'center',
        justifyContent: 'space-around'
       
    },

    userPhoto: {
        height: 20,
        width: 20,
        backgroundColor: 'white',
        
    },

    chittrHeaderText: {
        color: 'white',
        fontFamily: 'Courier New',
        fontSize: 30,
    },


});
export default chittr