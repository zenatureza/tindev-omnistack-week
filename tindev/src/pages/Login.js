import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAvoidingView, Platform, StyleSheet, Image, TextInput, TouchableOpacity, Text } from 'react-native';

import api from '../services/api';
import logo from '../assets/logo.png';

// react native navigation property is called 'navigation' (react is 'history')
// this property is accessible because on 'routes.js' we are choosing 'createSwitchNavigation'
// which blocks returning back to the main page (see another navigation types, like createBottomNavigation)
export default function Login({ navigation }) { 
    // starts user input state
    const [user, setUser] = useState('');  

    // runs this arrow function when the array of variables change 
    // because the array is empty, it will execute only once (when it gets into the login page)
    // so it tests if user variable has value, if has, should redirect it into main page
    // This behavior is expected because we dont need to login everytime we open tindev app 
    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.navigate('Main', { user });
            }
        });
    }, []);

    // async is needed to call the api
    async function handleLogin() {
        const response = await api.post('/devs', { username: user });

        const { _id } = response.data;
        await AsyncStorage.setItem('user', _id);
        
        navigation.navigate('Main', { user: _id });
    }
    
    return (
        <KeyboardAvoidingView 
            behavior="padding"
            enabled={Platform.OS === 'ios'}    
            style={styles.container}
        >
            <Image source={logo} />

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Digite o seu usuário no GitHub" 
                placeholderTextColor="#999"
                style={styles.input}
                value={user}
                onChangeText={setUser}
            />

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30
    },

    input: {
        height: 46,
        // makes it occupy the entire space
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },

    button: {
        backgroundColor: '#df4723',
        height: 46,
        alignSelf: 'stretch',
        borderRadius: 4,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
}); 