import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, } from 'react-native';
import Grid from 'react-native-grid-component';
import firestore from '@react-native-firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';


class CartPage extends Component {
    constructor() {
        super();
        this.renderItem = this.renderItem.bind(this);
        this.state = {
            cartItems: []
        }
    }

    componentDidMount() {
        const cartRef = firestore().collection('users').doc('PPJZH5YZUK6Km6kewvNg').collection('Cart');
        cartRef.onSnapshot((snap) => {
            this.setState({ cartItems: [] });
            snap.forEach(async (doc) => {
                const item = {
                    "docID": doc.id,
                    "name": doc.data().name,
                    "price": doc.data().price,
                    "imageLink": doc.data().imageLink,
                    "promo": doc.data().promo,
                };
                await this.setState({ cartItems: [...this.state.cartItems, item] })
            })
        })
    }

    render() {
        let cartSum = 0;
        this.state.cartItems.forEach((item) => {
            const numPrice = +item.price;
            cartSum += numPrice;
        })
        cartSum = Math.round(100 * cartSum) / 100;


        return (
            <ImageBackground source={require('../res/android-promotions.png')} style={styles.fullBackground} >
                <Text style={styles.YourCartText}>Your Cart</Text>

                <View style={styles.TotalPricesView}>
                    <Text style={styles.FirstTotal}>Total: ${cartSum}</Text>
                    <Text style={styles.TaxTotal}> ${Math.round(100 * 1.0825 * cartSum) / 100} with tax</Text>
                </View>

                <FlatList style={styles.flatContainer} keyExtractor={(item, index)=>index.toString()} renderItem={this.renderItem} data={this.state.cartItems} />
            </ImageBackground>
        )
    }


    renderItem = ({ item }) => (
        <View style={styles.itemBubble} >
            <Image source={{ uri: item.imageLink }} style={styles.itemImage}></Image>
            <Text style={styles.itemLabel}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
    )

}

export default CartPage;


const styles = StyleSheet.create({

    fullBackground:
    {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: 'center'
    },

    flatContainer:
    {
        marginTop: 30,
        flex: 1,
    },

    YourCartText:
    {
        fontSize: 24,
        alignSelf: "center",
        marginTop: 80,
        marginBottom: 80,
        fontFamily:'Segoe UI'
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
    itemImage:
    {
        alignSelf: "center",
        width: 45,
        height: 45,
        marginLeft: 10,
        marginRight: 0,
        borderRadius: 10,
        borderWidth: 10
    },
    itemLabel:
    {
        alignSelf: "center",
        marginLeft: 15,
        fontSize: 16,
        fontFamily:'Segoe UI'
    },
    itemPrice: {
        alignSelf: 'center',
        textAlign: 'right',
        marginLeft: 'auto',
        marginRight: 10
    },

    TotalPricesView:
    {
        alignSelf: "center",
        marginRight: 10
    },

    FirstTotal:
    {
        alignSelf: "flex-end",
        fontSize: 24,
        fontFamily:'Segoe UI',
        marginBottom:10
    },

    TaxTotal:
    {
        alignSelf: "center",
        fontSize: 16,
        fontFamily:'Segoe UI'
    },



});
