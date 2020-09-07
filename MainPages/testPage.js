import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Text, Image, FlatList,TextInput, TouchableOpacity, Modal, AsyncStorage } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FamilyTile from '../Models/Components/FamilyTile';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';

class testPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wishlists: [],

            didCount: false,
            countContacts: 0,
            
            contactModal: false,
            contactsLoading: false,

            contactNames: [],
            filteredContactNames: [],

            selectedNames: [],
            tempSelectedNames: [],
        }
        this.pullContactsFirebase = this.pullContactsFirebase.bind(this);
        this.getLists = this.getLists.bind(this);
        this.getLocalContacts = this.getLocalContacts.bind(this);
    }

    componentDidMount() {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                title: 'Contacts',
                message: 'This app would like to view your contacts',
                buttonPositive: 'OK',
                buttonNegative: 'Cancel'
            }
        );
        this.pullContactsFirebase();
        this.getLocalContacts();
        this.getLists();
    }

   


    render() {

        const { navigate } = this.props.navigation;

        return (
            <ImageBackground source={require('../res/android-promotions.png')} style={styles.fullBackground}  >
                <View style={styles.textView}><Text style={styles.yourWishlistsText}>Your Wishlists</Text></View>

                <View style={styles.wishlistGroupView}>
                    <FlatList data={this.state.wishlists} keyExtractor={(item, index) => index.toString()} renderItem={
                        ({ item }) => (
                            <TouchableOpacity onPress={() => navigate('Wishlist', { screen: 'EditWishlistPage', params: { listNameCallback: item } })} >
                                <View style={styles.wishlistSelect}>
                                    <Text style={styles.title}>{item}</Text>
                                </View>
                            </TouchableOpacity>)}
                    />
                </View>

                <View style={{ flexDirection: "column" }} >
                    <Text style={{ fontSize: 20, fontFamily: 'Segoe UI', marginLeft: 10 }}>Your Family</Text>
                    <TouchableOpacity style={{ backgroundColor: "#1B263B", borderWidth: 1, height: 30, width: 100, alignItems: "center", justifyContent: "center", margin: 10 }} onPress={() => this.setState({ contactModal: true })}>
                        <Text style={{ color: "white", fontFamily: "Segoe UI" }}>Add Family</Text>
                    </TouchableOpacity>
                </View>

                <FlatList data={this.state.selectedNames} horizontal={true} renderItem={({ item }) => (<FamilyTile name={item} />)} />

                <Modal animationType="slide" transparent={true} visible={this.state.contactModal} onRequestClose={() => this.setState({ contactModal: false })} >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Which contact would you like to add?</Text>
                            <TextInput placeholder="Search contacts by name" onChangeText={(val) => this.searchContacts(val)}></TextInput>

                            <FlatList data={this.state.filteredContactNames} keyExtractor={(item, index) => index} initialNumToRender={100} renderItem={this.renderItem} />

                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity style={{ width: 80, height: 40, borderWidth: 1, justifyContent: 'center', marginTop: 20 }} onPress={() => this.setState({ contactModal: false, contactsLoading: false })}>
                                    <Text style={styles.title}>Cancel</Text>
                                </TouchableOpacity>
                                {(this.state.selectedNames.length === 0 && this.state.tempSelectedNames.length === 0)? (<></>) : (
                                    <TouchableOpacity style={{ width: 80, height: 40, borderWidth: 1, justifyContent: 'center', marginTop: 20, marginLeft: 20 }} onPress={this.pushContactsFirebase}>
                                        <Text style={styles.title}>Ok</Text>
                                    </TouchableOpacity>)}
                            </View>

                        </View>
                    </View>
                </Modal>

            </ImageBackground>
        )
    }

    async getLists() {
        //Retrieve names of wishlists

        const userID = auth().currentUser.uid;

        const wishRef = firestore().collection('users').doc(userID).collection('Wishlists');

        await wishRef.onSnapshot((snap) => {
            this.setState({ wishlistSelect: [] });
            snap.forEach((doc, index) => {
                this.setState({ wishlists: [...this.state.wishlists, doc.id] });
            })
        })

    }

    initialContactState(name) {
        return this.state.selectedNames.includes(name);
    }

    async getLocalContacts() {

        Contacts.getCount(async (count) => {
            await this.setState({ countContacts: count + 1, didCount: true });
        });

        if (this.state.didCount) {
            try {
                const list = await AsyncStorage.getItem('storedContactNames');

                const parsedList = JSON.parse(list);
                const numStored = parsedList.length;

                if (numStored === this.state.countContacts) {
                    await this.setState({ contactNames: parsedList, contactsLoading: false, filteredContactNames: parsedList });
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        else if (this.state.didCount && (this.state.contactNames.length === 0 || this.state.contactNames.length !== this.state.countContacts)) {

            this.setState({ contactsLoading: true });
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Contacts',
                    message: 'This app would like to view your contacts',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel'
                }
            ).then(() => {
                Contacts.getAll(async (err, contacts) => {
                    if (err === 'denied') {
                        alert('Contacts access was not granted')
                    }
                    else {
                        if (contacts) {
                            contacts.forEach((con) => {
                                this.setState({ contactNames: [...this.state.contactNames, con.displayName] });
                            });
                            this.setState({ contactsLoading: false, filteredContactNames: this.state.contactNames });
                            const stringedContacts = JSON.stringify(this.state.contactNames);
                            await AsyncStorage.setItem('storedContactNames', stringedContacts);

                        }
                    }
                })
            })
        }
    }

    async pullContactsFirebase() {
        const userID = auth().currentUser.uid;
        const famRef = firestore().collection('users').doc(userID).collection('Family');
        
        await famRef.onSnapshot(async (snap) => {
            this.setState({selectedNames:[], tempSelectedNames:[]});
            snap.forEach(async (doc) => {
                await this.setState({ selectedNames: [...this.state.selectedNames, doc.data().name], tempSelectedNames: [...this.state.tempSelectedNames, doc.data().name] })
            })
        })
    }

    async pushContactsFirebase() {
        this.setState({ contactModal: false });
        const userID = auth().currentUser.uid;
        const famRef = firestore().collection('users').doc(userID).collection('Family');

        famRef.get().then((snap) => {
            snap.forEach((doc) => {
                if (!this.state.tempSelectedNames.includes(doc.data().name)) {
                    famRef.doc(doc.id).delete();
                }
            })
        })

        this.state.tempSelectedNames.forEach((tempName) => {
            if (!this.state.selectedNames.includes(tempName)) {
                famRef.add({
                    name: tempName
                });
            }
        });
    }

    searchContacts(val) {
        const tempFilteredList = []
        this.state.contactNames.filter((name) => {
            if (name.includes(val)) {
                tempFilteredList.push(name);
            }
        })
        if (tempFilteredList) {
            this.setState({ filteredContactNames: tempFilteredList });
        }
        if (val === '') {
            this.setState({ filteredContactNames: this.state.contactNames })
        }
    }

    logItem(name, isSelected) {
        if (isSelected) {
            this.setState({ tempSelectedNames: [...this.state.tempSelectedNames, name] })
        }
        if (!isSelected) {
            let tempNames = this.state.tempSelectedNames;
            tempNames = tempNames.filter((item) => item !== name);
            this.setState({ tempSelectedNames: tempNames });
        }

    }
}

export default testPage;


const styles = StyleSheet.create(
    {
        fullBackground:
        {
            flex: 1,
            width: "100%",
            height: "100%"
        },

        wishlistButton:
        {
            backgroundColor: "grey",
            marginStart: 20,
            marginEnd: 20,
            marginBottom: 20,

        },
        title: {
            fontSize: 18,
            alignSelf: 'center',
            fontFamily: 'Segoe UI'
        },


        wishlistGroupView:
        {
            padding: 30,
            paddingTop: 20,
            alignItems: 'center',
            marginBottom: 40
        },
        buttonText: {
            color: "black"
        },
        yourWishlistsText:
        {
            fontSize: 24,
            marginTop: 40,
            marginBottom: 0,
            alignSelf: "center",
            fontFamily: 'Segoe UI'
        },
        textView: {
            alignContent: "center",
        },
        ItemImage:
        {
            alignSelf: "flex-start",
            width: 30,
            height: 30,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 10,
        },
        itemLabel:
        {
            alignSelf: "center",
            marginLeft: 40,
            fontSize: 16
        },
        wishlistSelect: {
            borderWidth: 2,
            marginLeft: 20,
            marginTop: 20,
            height: 40,
            width: 250,
            textAlign: 'center',
            justifyContent: 'center',
            borderRadius: 10
        },

        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",

            fontFamily: 'Segoe UI'
        },
        modalView: {
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            height: 500,
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center",
            fontFamily: 'Segoe UI'
        },
});