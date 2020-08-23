import React, {Component} from 'react';

import { StyleSheet, View,  Text , TextInput , ImageBackground, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';


class MapPage extends Component {
    constructor(){
        super();
        this.state = {
            focused:false,
            backSearches:[],
        }
        this.searchItems = this.searchItems.bind(this);
    }

    async searchItems(val){
        
        hebRef = firestore().collection("stores").doc("HEB").collection('items');
        const searchQuery = hebRef.where("name", "in", val );
        await searchQuery.onSnapshot(async(snap)=>{
            let tempSearch = [];
            snap.forEach((doc) =>{
                const item = {
                    "docID": doc.id,
                    "name": doc.data().name,
                    "price": doc.data().price,
                    "imageLink": doc.data().imageLink,
                    "promo": doc.data().promo,
                };
                tempSearch.push(item);
            });
            await this.setState({backSearches:tempSearch});
        });

    }

    render(){
      return(
        <ImageBackground source={require('../res/android-promotions.png')} style={styles.fullBackground} >
            <View style ={styles.mapContainer}>

                <View style = {styles.mapTitleView}>
                    <Text style = {{fontSize: 24, fontFamily:'Segoe UI'}}>Map</Text>
                </View>

                <View style = {styles.mapView}>
                    <Image source = {require('../res/map-image-right-size.png')} style = {styles.mapImage}  />
                </View>
                <View style = {styles.searchBarView}>
                    <TextInput style={styles.searchInput} onChange={(val)=>{this.searchItems(val)}} backgroundColor = "#a2a3a1" placeholderTextColor='#545454' placeholder="Search this store" ></TextInput>
                </View>

            </View>
        </ImageBackground>
    )
  }
}




export default MapPage;


const styles = StyleSheet.create({
    mapContainer:{
        flex:1,
    },
    mapTitleView:
    {
        flex:1,
        backgroundColor:"transparent",
        justifyContent:"center",
        alignItems:"center"
    },

    mapView:{
        flex:3,
        backgroundColor:"transparent",
        
        alignItems: "center"
        
    },

    searchBarView:
    {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        fontFamily:'Segoe UI'
    },
    
    searchInput:
    {
        width:"65%",
        paddingLeft:5,
        paddingRight: 5,
        borderRadius:25,
        textAlign:"center",
        borderWidth:2,
        borderColor:"#545454",
        fontFamily:'Segoe UI',
        fontSize:24,
        color:'black'
    },

    fullBackground:
    {
        flex:1,
        width:"100%"
    },

});
