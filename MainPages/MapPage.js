import React, {Component} from 'react';

import { StyleSheet, View,  Text , TextInput , ImageBackground, Image} from 'react-native';



class MapPage extends Component {
    constructor(){
        super();
        this.state = {
            focused:false
        }
    }
    render(){
      return(
        <ImageBackground source={require('../res/android-promotions.png')} style={styles.fullBackground} >
            <View style ={styles.mapContainer}>

                <View style = {styles.mapTitleView}>
                    <Text style = {{fontSize: 24}}>Map</Text>
                </View>

                <View style = {styles.mapView}>
                    <Image source = {require('../res/map-image-right-size.png')} style = {styles.mapImage}  />
                </View>
                <View style = {styles.searchBarView}>
                    <TextInput onEndEditing= {() => {this.setState({focused:false}); }  } backgroundColor = "transparent"  placeholder= "Search this store" placeholderTextColor={this.state.focused ? "white" : "black"} style = {this.state.focused ? styles.searchInputFocused : styles.searchInput}  onFocus = {() => {this.setState({focused:true}); }  }   ></TextInput>
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
        borderBottomWidth:2,
        alignItems: "center"
        
    },

    searchBarView:
    {
        flex:1,
        borderBottomWidth:2,
        justifyContent: "center",
        alignItems: "center",
    },
    searchInput:
    {
        width:"65%",
        paddingLeft:5,
        paddingRight: 5,
        borderRadius:25,
        textAlign:"center",
        borderWidth:2,
        borderColor:"#707070",
        fontWeight: "bold",        
    },
    searchInputFocused:
    {
        backgroundColor:"rgba(0,0,0,0.25)",
        width:"65%",
        paddingLeft:5,
        paddingRight: 5,
        borderRadius:25,
        textAlign:"center",
        borderWidth:2,
        borderColor:"#707070",
        fontWeight: "bold",    
          
    },

    fullBackground:
    {
        flex:1,
        width:"100%"
    },

    

});
