import React, { useState, useEffect } from 'react';
import { Button, Card, Icon, LinearGradient } from 'react-native-elements';
import { ImageBackground, Image, StyleSheet, View, Text, ScrollView, FlatList, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { TouchableHighlight } from 'react-native-gesture-handler';



function ItemPage({ route }) {

    const [thing, setThing] = useState(null);
    const [wishlistModal, setWishlistModal] = useState(false);
    const [wishlists, setWishlists] = useState([]);

    const navigate = useNavigation();

    useEffect(() => {
        setThing(route.params.itemIDCallback);
    });

    function getLists() {
        //Retrieve names of wishlists
        const wishRef = firestore().collection('users').doc('PPJZH5YZUK6Km6kewvNg').collection('Wishlists');
        let lists = [];
        wishRef.onSnapshot((snap) => {
            snap.forEach(doc => {
                const listname = doc.id;
                lists.push(listname);
            })
        })
        setWishlists(lists);
        setTimeout(() => { setWishlistModal(true) }, 100);
    }

    function addToCart() {
        const cartRef = firestore().collection('users').doc('PPJZH5YZUK6Km6kewvNg').collection('Cart');
        cartRef.add({
            docID: thing.docID,
            name: thing.name,
            price: thing.price,
            imageLink: thing.imageLink,
            promo: thing.promo,
        });
        navigate.navigate('Cart');
    }

    function addToWishlist(listname){
        const wishRef = firestore().collection('users').doc('PPJZH5YZUK6Km6kewvNg').collection('Wishlists').doc(listname).collection('items');
        wishRef.add({
            docID: thing.docID,
            name: thing.name,
            price: thing.price,
            imageLink: thing.imageLink,
            promo: thing.promo,
        });

        navigate.navigate('Wishlist', {screen:'EditWishlistPage', params:{listNameCallback: listname}});
    }

    const LISTS = [
        { title: wishlists[0], id: '1' },
        { title: wishlists[1], id: '2' },
        { title: wishlists[2], id: '3' }
    ]

    return (
        <ImageBackground source={require('../../res/android-promotions.png')} style={styles.fullBackground} >

            <View style={styles.backButtonView}>
                <Button title="go back" onPress={() => navigate.goBack()} style={styles.backButton} />
            </View>

            {(!thing) ? (<Text>Loading...</Text>) :

                (<ScrollView>
                    <View style={styles.bigApple}>

                        <Text style={styles.itemNameText}>{thing.name} </Text>

                        <Image style={styles.itemImage} source={{ uri: thing.imageLink }} />
                        <Text style={styles.itemPriceText}>${thing.price}</Text>
                        <Card style={styles.chartCard} title="Price History" image={require('../../res/stocks_chart_image.png')}><Text>Here are the stonks for this item</Text></Card>

                        <TouchableOpacity style={styles.bottomButtons} title="Add to Cart" onPress={addToCart} >
                            <Text style={styles.title}>Add to Cart</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.bottomButtons} title="Add to Wishlist" onPress={getLists} >
                            <Text style={styles.title}> Add to Wishlist</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>)
            }

            <Modal animationType="slide" transparent={true} visible={wishlistModal} onRequestClose={() => setWishlistModal(false)} >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Which wishlist would you like to add it to?</Text>

                        <FlatList data={LISTS} keyExtractor={(item) => item.id} renderItem={
                            ({ item }) =>
                                (<TouchableOpacity style={styles.wishlistSelect} onPress={()=>addToWishlist(item.title)}><Text style={styles.title}>{item.title}</Text></TouchableOpacity>)
                        } />

                        <TouchableOpacity style={{width:80, height:40, borderWidth:1, justifyContent:'center'}} onPress={() => setWishlistModal(false)}>
                            <Text style={styles.title}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    )

}

export default ItemPage;

const styles = StyleSheet.create(
    {
        fullBackground:
        {
            flex: 1,
            width: "100%",
            height: "100%"
        },

        bigApple: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        },
        bottomButtons: {
            marginBottom: 20,
            marginTop:40,
            width: 200,
            height: 60,
            backgroundColor:'#b3d6db',
            justifyContent:'center',
            borderWidth:2,
        },
        itemImage: {
            marginBottom: 50,
            flex: 1,
            width: 150,
            height: 150,
        },
        itemNameText: {
            fontSize: 30,
            paddingBottom: 50,
        },
        itemPriceText: {
            fontSize: 35,
            paddingBottom: 50
        },
        
        spacer: {
            height: 20,
        },
        backButton: {

            flex: 1,
        },
        backButtonView: {
            justifyContent: "center",
            alignContent: "center",
            width: 100,
            alignSelf: 'flex-start'
        },
        chartCard: {
            marginBottom: 50,
        },
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
        },
        modalView: {
            margin: 20,
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
            height:350,
        },
        openButton: {
            backgroundColor: "#F194FF",
            borderRadius: 20,
            padding: 10,
            elevation: 2
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center"
        },

        wishlistSelect: {
            backgroundColor: '#5cbcc9',
            padding: 0,
            marginTop:20,
            height:40,
            width:200,
            textAlign:'center',
            justifyContent:'center'
        },
        title: {
            fontSize: 18,
            alignSelf:'center',
        },
    }
);