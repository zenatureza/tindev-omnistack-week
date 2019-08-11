import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SafeAreaView, Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import itsamatch from '../assets/itsamatch.png';
import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

import api from '../services/api';

export default function Main({ navigation }) {
    // similar to match.params to get id passed by login page
    const id = navigation.getParam('user');

    // two members: state value, and function that updates state value
    const [users, setUsers] = useState([]);

    // the matchdev component should have a null state, so a 'its a match' wont appear initially
    const [matchDev, setMatchDev] = useState(null);

    // loads available users on the page
    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id,
                }
            });
            
            // sets 'useState([]) array to response.data (which has the visible users available to the current logged user)'
            setUsers(response.data);
        };

        loadUsers();
    }, [id]);

    // this use effect connects to the websocket
    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: {
                // sends a parameter to the backend after connection
                user: id
            }
        });
        
        // when a match happens, the server will warn the front end automatically through the websocket stablished
        socket.on('match', dev => {
            setMatchDev(dev);
        });
    }, [id]);

    // handle like from user identified by 'id' param
    async function handleLike() {
        // gets first user, and the rest of users are stored inside ...rest variable
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id },
        });

        // after like, we need to remove the liked person from the list of available people to like
        setUsers(rest);
    }

    async function handleDislike() {
        // gets first user, and the rest of users are stored inside ...rest variable
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id },
        });

        // updates screen right after api call (actually i'm updating users state!)
        setUsers(rest);
    }

    // when user clicks on 'tindev' logo we need to redirect to login page, clearing user data inside asyncstorage
    async function handleLogout() {
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    return (
        // places logo only on usable space of screen
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>

            {/* users info container */}
            <View style={styles.cardsContainer}>
                {/* for each user creates cards 
                -- using zIndex we overflow each card.. the bigger number'll represent the visible user
                */}
                { users.length === 0 ?
                    <Text style={styles.empty}>Acabou :(</Text> 
                : 
                (
                    users.map((user, index) => (
                        // we need to specify a unique key to react be able to act over elements
                        <View key={user._id} style={[ styles.card, { zIndex: users.length - index } ]}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))
                )
                }
            </View>

            {/* only executes function if users.length > 0 */}
            { users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDislike}>
                        <Image source={dislike}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Image source={like}/>
                    </TouchableOpacity>
                </View>
            ) }

            { matchDev && (
                <View style={styles.matchContainer}>
                    <Image source={itsamatch} style={styles.matchTitle}/>

                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>

                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            ) }
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
        
    },

    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        // show only one card/time
        position: 'absolute',
        // occupies the entire 'maxHeight' from 'cardsContainer'
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    avatar: {
        flex: 1,
        height: 300
    },

    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
       fontSize: 14,
       color: '#999',
       marginTop: 2,
       lineHeight: 18, 
    },

    logo: {
        marginTop: 30
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },

    button: {
        width: 50,
        height: 50,
        // to be a completely circle button, we need to set half width and height
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        // shadow for android
        elevation: 2,
        // shadow for ios
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    empty: {
        alignSelf: 'center',
        color: '#999',
        fontWeight: 'bold',
        fontSize: 24
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    matchTitle: {
        height: 60,
        resizeMode: 'contain'
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },

    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
    },

    closeMatch: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold',
    },
});