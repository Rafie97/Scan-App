import React, { Component } from 'react';

import { StyleSheet, View, Text, TextInput, ImageBackground, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Item from '../Models/Item';
import { FlatList } from 'react-native-gesture-handler';


class MapPage extends Component {
    constructor() {
        super();
        this.state = {
            focused: false,
            backSearches: [],
        }
        this.searchItems = this.searchItems.bind(this);
    }

    async searchItems(val) {

        const BreakException = {};
        hebRef = firestore().collection("stores").doc("HEB").collection('items');
        await hebRef.get().then(async (qSnap) => {
            try {
                await this.setState({ backSearches: [] })
                qSnap.forEach(async (doc, index) => {

                    if (doc.data().name.includes(val)) {
                        const item = new Item(doc.id, doc.data().name, doc.data().price, doc.data().imageLink, doc.data().barcode, doc.data().promo, null);
                        await this.setState({ backSearches: [...this.state.backSearches, item] })
                    }
                })
            }
            catch (e) {
                if (e !== BreakException) throw e;
            }
        });


    }

    render() {
        return (
            <ImageBackground source={require('../res/android-promotions.png')} style={styles.fullBackground} >

                <View style={styles.mapTitleView}>
                    <Text style={{ fontSize: 24, fontFamily: 'Segoe UI' }}>Map</Text>
                </View>

                <View style={styles.mapView}>
                    <Image source={require('../res/map-image-right-size.png')} style={styles.mapImage} />
                </View>
                {/*<View style={{borderWidth:2, height:150,width:300, flex:1, alignSelf:"center"}}>
                        <FlatList></FlatList>
                </View>*/}
                <View style={styles.searchBarView}>
                    <TextInput style={styles.searchInput} onChangeText={(val) => { this.searchItems(val) }} backgroundColor="#a2a3a1" placeholderTextColor='#545454' placeholder="Search this store" ></TextInput>
                </View>

            </ImageBackground>
        )
    }
}




export default MapPage;


const styles = StyleSheet.create({

    mapTitleView:
    {
        backgroundColor: "transparent",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 20
    },

    mapView: {
        alignItems: "center",
        flex:4
    },

    searchBarView:
    {
        alignItems: "center",
        fontFamily: 'Segoe UI',
        marginBottom: 10,
        flex: 1
    },

    searchInput:
    {
        width: "65%",
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 25,
        textAlign: "center",
        borderWidth: 2,
        borderColor: "#545454",
        fontFamily: 'Segoe UI',
        fontSize: 20,
        color: 'black'
    },

    fullBackground:
    {
        flex: 1,
        width: "100%",
        flexDirection: "column"
    },

});
