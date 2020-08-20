import React, { Component } from 'react';
import { Button, Icon, LinearGradient } from 'react-native-elements';
import { ImageBackground, StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Grid from 'react-native-grid-component';
import firestore from '@react-native-firebase/firestore';



class EditWishlistPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listItems: []
        }

        this.getItems = this.getItems.bind(this);
    }

    componentDidMount() {
        this.getItems();
    }

    async getItems() {
        wishRef = firestore().collection("users").doc("PPJZH5YZUK6Km6kewvNg").collection('Wishlists').doc(this.props.route.params.listNameCallback).collection('items');

        await wishRef.onSnapshot((snap) => {
            this.setState({ listItems: [] })
            snap.forEach((doc) => {
                const item = {
                    "docID": doc.id,
                    "name": doc.data().name,
                    "price": doc.data().price,
                    "imageLink": doc.data().imageLink,
                    "promo": doc.data().promo,
                };
                this.setState({ listItems: [...this.state.listItems, item] });
            })
        });

    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <ImageBackground style={styles.fullBackground} source={require('../../res/android-promotions.png')} >

                <View style={styles.backButtonView}>
                    <Button title="go back" onPress={() => navigate('MainWishlistPage')} style={styles.backButton} />
                </View>

                <Text style={styles.ListNameText}>{this.props.route.params.listNameCallback}</Text>

                <View style={{ "flex": 1, justifyContent: "flex-start" }}>
                    <View style={styles.wishlistGroupView}>
                        <FlatList keyExtractor={(item, index) => index.toString()} data={this.state.listItems} renderItem={this.renderItem} />
                    </View>
                </View>



            </ImageBackground>
        );
    }


    renderItem = ({ item }) => (
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigate('Wishlist', { screen: 'WishItemPage', params: { itemIDCallback: item } })} >
            <View style={styles.itemBubble} >
                <Image source={{ uri: item.imageLink }} style={styles.ItemImage}></Image>
                <Text style={styles.itemLabel}>{item.name}</Text>
                <Text style={styles.itemLabel}>{item.price}</Text>
            </View>
        </TouchableOpacity>

    );

}

export default EditWishlistPage;

const styles = StyleSheet.create({
    fullBackground: {
        flex: 1,
        width: "100%",
        height: "100%",
        borderWidth: 3,
        borderColor: "purple"
    },
    wishlistGroupView:
    {
        padding: 30,
        paddingTop: 20,
        borderWidth: 5,
        borderColor: "blue",

    },
    wishlistButton:
    {
        opacity: 100,
        marginStart: 20,
        marginEnd: 20,
        marginBottom: 20,
    },
    backButton: {
        width: 20,
        flex: 1,
    },
    backButtonView:
    {
        justifyContent: "center",
        alignContent: "center",
        width: 150,
        alignSelf: 'flex-start'
    },
    gridContainer:
    {
        flex: 1,

    },
    ListNameText:
    {
        fontSize: 40,
        textAlign: "center",
        paddingTop: 60
    },
    itemBubble:
    {
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderRadius: 20,
        flexDirection: "row",
        width: 300,
        height: 60,
        marginTop: 20,
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

})
