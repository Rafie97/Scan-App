import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Modal, AsyncStorage } from 'react-native';
require('react-native-linear-gradient').default;
import FamilyTile from '../Models/Components/FamilyTile';
import firestore from '@react-native-firebase/firestore';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import { TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';


class WishlistPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wishlists: [],
            contactNames: [],
            contactModal: false,
            contactsLoading: false,
            filteredContactNames:[]

        }
        this.getLists = this.getLists.bind(this);
        this.getContacts = this.getContacts.bind(this);
    }

    componentDidMount() {
        this.getLists();
        this.getContacts();
    }


    async getLists() {
        //Retrieve names of wishlists
        const wishRef = firestore().collection('users').doc('PPJZH5YZUK6Km6kewvNg').collection('Wishlists');
        await wishRef.onSnapshot((snap) => {
            snap.forEach((doc, index) => {
                const listname = {
                    "title": doc.id,
                }
                this.setState({ wishlists: [...this.state.wishlists, listname] });
            })
        })
    }

    getContacts() {
        if (this.state.contactNames.length === 0 || this.state.contactNames.length !== Contacts.getCount) {

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
                            this.setState({  contactsLoading: false , filteredContactNames:this.state.contactNames});
                            
                        }
                    }
                })
            })
        }
    }

    searchContacts(val){
        const tempFilteredList=[]
        this.state.contactNames.filter((name)=>{
            if(name.includes(val))
            {
                tempFilteredList.push(name);
            }
        })
        if(tempFilteredList)
        {
            this.setState({filteredContactNames:tempFilteredList});
        }
        if(val ==='')
        {
            this.setState({filteredContactNames:this.state.contactNames})
        }
    }


    render() {
        const { navigate } = this.props.navigation;

        return (
            <ImageBackground source={require('../res/android-promotions.png')} style={styles.fullBackground}  >
                <View style={styles.textView}><Text style={styles.yourWishlistsText}>Your Wishlists</Text></View>


                <View style={styles.wishlistGroupView}>
                    <FlatList data={this.state.wishlists} keyExtractor={(item, index) => index.toString()} renderItem={
                        ({ item }) => (
                        <TouchableOpacity  onPress={() => navigate('Wishlist', { screen: 'EditWishlistPage', params: { listNameCallback: item.title } })} >
                            <LinearGradient style={styles.wishlistSelect}   colors={['#D2D2D2','#A2A2A2']}>
                                <Text style={styles.title}>{item.title}</Text>
                            </LinearGradient>
                        </TouchableOpacity>)}
                    />
                </View>

                <View ><Text style={{ fontSize: 20, fontFamily:'Segoe UI', marginLeft:10 }}>Your Family</Text></View>

                {this.state.contactsLoading ? (<Text>Loading...</Text>) : (
                <TouchableOpacity onPress={()=>this.setState({contactModal:true})}>
                    <Text>TOUCH THIS TO ADD CONTACTS</Text>
                </TouchableOpacity>)}

                <Modal animationType="slide" transparent={true} visible={this.state.contactModal} onRequestClose={() => this.setState({ contactModal: false })} >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Which contact would you like to add?</Text>
                            <TextInput placeholder="Search contacts by name" onChangeText={(val) => this.searchContacts(val)}></TextInput>

                            <FlatList data={this.state.filteredContactNames} keyExtractor={(item, index) => index} initialNumToRender={100} renderItem={
                                ({ item }) =>
                                    (<TouchableOpacity style={styles.contactSelect} ><Text style={styles.title}>{item}</Text></TouchableOpacity>)
                            } />

                            <TouchableOpacity style={{ width: 80, height: 40, borderWidth: 1, justifyContent: 'center', marginTop: 20 }} onPress={() => this.setState({ contactModal: false, contactsLoading: false })}>
                                <Text style={styles.title}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <FlatList horizontal={true}>
                    <Image source={require('../res/mom-rect.png')} name="Mom" ></Image>
                    <Image source={require('../res/dadimg.png')}  ></Image>
                    <FamilyTile imageUri='../res/dadimg.png' name="Dad"  ></FamilyTile>
                    <FamilyTile imageUri={require('../res/dadimg.png')} name="Josh" ></FamilyTile>
                </FlatList>

            </ImageBackground>
        )
    }

}




export default WishlistPage;



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

        wishlistGroupView:
        {
            padding: 30,
            paddingTop: 20,
            alignItems: 'center'
        },
        buttonText: {
            color: "black"
        },
        yourWishlistsText:
        {
            fontSize: 24,
            marginTop: 80,
            marginBottom: 0,
            alignSelf: "center",
            fontFamily:'Segoe UI'
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
        contactSelect: {
            marginLeft: 20,
            marginTop: 20,
            height: 40,
            width: 250,
            textAlign: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: 18,
            alignSelf: 'center',
            fontFamily:'Segoe UI'
        },
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 0,
            fontFamily:'Segoe UI'
        },
        modalView: {
            margin: 0,
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
            fontFamily:'Segoe UI'
        },
    });