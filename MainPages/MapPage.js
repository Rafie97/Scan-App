import React, { Component } from 'react';

import { StyleSheet, View, Text, TextInput, ImageBackground, Image, Animated } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Item from '../Models/Item';
import { FlatList } from 'react-native-gesture-handler';
import MapBubble from '../Models/Components/MapBubble';


class MapPage extends Component {
    constructor() {
        super();
        this.state = {
            titleHeight:null,
            searchFocused: false,
            backSearches: [],
            markedAisles:[],
        }
        this.searchItems = this.searchItems.bind(this);
        this.drawCircles = this.drawCircles.bind(this);

    }

    async searchItems(val) {
        if(val ==="" || val===" "){
            await this.setState({ backSearches: [] })
        }

        else if (val !== ""){
            await this.setState({ backSearches: [] })
            const BreakException = {};
            const hebRef = firestore().collection("stores").doc("HEB").collection('items');
            await hebRef.get().then(async (qSnap) => {
                try {
                    
                    qSnap.forEach(async (doc, index) => {

                        if (doc.data().name.includes(val)) {
                            const item = new Item(doc);
                            await this.setState({ backSearches: [...this.state.backSearches, item] })
                        }
                    })
                }
                catch (e) {
                    if (e !== BreakException) throw e;
                }
            });

            
        }

        if (this.state.backSearches) {
            console.log(this.state.backSearches.length)
            const aislesTemp = []
            this.state.backSearches.forEach((el)=>{
                aislesTemp.push(el.location);
            })
            this.setState({markedAisles : aislesTemp});
        }
        
    }

    drawCircles(){
        if(this.state.markedAisles)
        {
            return this.state.markedAisles.map(function(loc){
                return <MapBubble location={loc} /> ;
            })
        }
    }

    render() {

        return (
            <ImageBackground source={require('../res/android-promotions.png')} style={styles.fullBackground} >

                <View style={styles.mapTitleView}>
                    <Text style={{ fontSize: 24, fontFamily: 'Segoe UI' }}>Map</Text>
                </View>

                <View style={styles.mapView}>
                    <ImageBackground source={require('../res/map-image-right-size.png')} style={{ width: 375, height: 300 }} >
                        {this.state.markedAisles?   this.drawCircles() :  {}  }
                        

                    </ImageBackground>
                </View>

                <View style={styles.searchBarView}>
                    <TextInput style={styles.searchInput} onChangeText={(val) => { this.searchItems(val) }} onFocus={() => this.setState({ searchFocused: true })} onBlur={() => this.setState({ searchFocused: false })}
                        backgroundColor="#a2a3a1" placeholderTextColor='#545454' placeholder="Search this store" >
                    </TextInput>
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
        flex: 4
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
