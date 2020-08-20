import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableOpacity, Button } from 'react-native';
import Grid from 'react-native-grid-component';
import firestore from '@react-native-firebase/firestore';



class PromotionsPage extends Component {
  constructor() {

    super();
    this.renderItem = this.renderItem.bind(this);
    this.state = {
      loading: true,
      promoItems: []
    }

    this.getItems= this.getItems.bind(this);
  }

  componentDidMount(){
    this.getItems();
  }

  async getItems() {
    hebRef = firestore().collection("stores").doc("HEB").collection('items')
    
    await hebRef.onSnapshot((snap) =>{
      this.setState({ promoItems: [] })
      snap.forEach(doc=>{
        const item = {
          "docID": doc.id,
          "name": doc.data().name,
          "price": doc.data().price,
          "imageLink": doc.data().imageLink,
          "promo": doc.data().promo,
        };
        this.setState({promoItems:[...this.state.promoItems, item]});
      })
    })
  }


  render() {
    return (
      <ImageBackground source={require('../res/android-promotions.png')} style={styles.fullBackground} >
        <View style={styles.promoPageContainer} >

          <Text style={styles.promoTitle}>Today's Best Deals</Text>

          <Grid style={styles.gridContainer} renderItem={this.renderItem} data={this.state.promoItems} numColumns={2} />

        </View>
      </ImageBackground>

    )
  }


  renderItem(data, i) {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.itemBox} key={i}>
        <TouchableOpacity style={styles.imageBox}  activeOpacity={0.5} onPress={() => navigate('Promotions', {screen:'PromoItemPage', params:{itemIDCallback: this.state.promoItems[i]}})} >
          <Image style={styles.itemImage} source={{ uri: this.state.promoItems[i].imageLink }} />
          <Text style={styles.itemTitleText}>{this.state.promoItems[i].name}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default PromotionsPage;



const styles = StyleSheet.create({

  promoPageContainer: {
    backgroundColor: "transparent",
    flex: 1,
  },

  promoTitle: {
    marginTop: 80,
    marginBottom: 80,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "SegoeUI"
  },

  promoFooter: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#c8e8e4",
    justifyContent: "space-around",
  },

  imageBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 20,
  },

  itemBox: {
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
    flex:1,
    maxWidth:160
  },

  itemTitleText: {
    textAlign: "center",
    marginBottom:5,
  },

  fullBackground:
  {
    flex: 1,
    width: "100%"
  },

  itemImage: {
    marginTop: 5,
    marginBottom: 0,
    flex: 1,
    width: 100,
    height: 100,
    borderRadius:10,
  }

});