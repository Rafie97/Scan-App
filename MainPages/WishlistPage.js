import React, { Component } from 'react';
import { Button, Icon, LinearGradient } from 'react-native-elements';
import { ImageBackground, StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
require('react-native-linear-gradient').default;
import FamilyTile from '../Models/Components/FamilyTile';
import firestore from '@react-native-firebase/firestore';



class WishlistPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wishlists: [],
        }
        this.getLists = this.getLists.bind(this);
    }

    componentDidMount() {
        this.getLists();
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



    render() {
        const { navigate } = this.props.navigation;

        return (
            <ImageBackground source={require('../res/android-promotions.png')} style={styles.fullBackground}  >
                <View style={styles.textView}><Text style={styles.yourWishlistsText}>Your Wishlists</Text></View>


                <View style={styles.wishlistGroupView}>
                    <FlatList data={this.state.wishlists} keyExtractor={(item, index) => index.toString()} renderItem={
                        ({ item }) => (<TouchableOpacity style={styles.wishlistSelect} onPress={() => navigate('Wishlist', { screen: 'EditWishlistPage', params: { listNameCallback: item.title } })} ><Text style={styles.title}>{item.title}</Text></TouchableOpacity>)}
                    />
                </View>


                <View ><Text style={{ fontSize: 20 }}>Your Family</Text></View>
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
            alignSelf: "center"
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
            backgroundColor: 'grey',
            borderWidth: 2,
            marginLeft: 20,
            marginTop: 20,
            height: 40,
            width: 250,
            textAlign: 'center',
            justifyContent: 'center',
            borderRadius: 10
        },
        title: {
            fontSize: 18,
            alignSelf: 'center',
        },
    });