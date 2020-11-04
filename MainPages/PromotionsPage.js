import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import Grid from 'react-native-grid-component';
import firestore from '@react-native-firebase/firestore';
import Item from '../Models/Item';
import FamilyTile from '../Models/Components/FamilyTile';


class PromotionsPage extends Component {
  constructor() {

    super();
    this.renderItem = this.renderItem.bind(this);
    this.state = {
      loading: true,
      promoItems: []
    }

    this.getItems = this.getItems.bind(this);
  }

  componentDidMount() {
    this.getItems();
  }

  async getItems() {
    const hebRef = firestore().collection("stores").doc("HEB").collection('items')

    hebRef.onSnapshot((snap) => {
      this.setState({ promoItems: [] })
      snap.forEach(async (doc) => {
        const item = new Item(doc);
        await this.setState({ promoItems: [...this.state.promoItems, item] });
      })
    })
  }


  render() {
    
    let arr = [];
    this.state.promoItems.forEach((i)=>{
      arr = [...arr, i.name];
    })

    console.log('Arrrrr', arr);

    return (
      <ImageBackground source={require('../res/android-promotions.png')} style={styles.fullBackground} >
        <View style={styles.promoPageContainer} >

          <Text style={styles.promoTitle}>Today's Best Deals</Text>

          <Text>Explore our best picks</Text>
          <View style={{height:200, marginTop:20}}>
            <FlatList  data={['Weekly deals', 'Fall flavors', 'Halloween Specials', 'Savings on appliances']} horizontal={true} renderItem={({ item }) => (<FamilyTile name={item} />)} />
          </View>
          <Text>Explore our coupons</Text>
          <FlatList data={this.state.promoItems} horizontal={true} renderItem={this.renderItem}  />


          {//<Grid style={styles.gridContainer} renderItem={this.renderItem} data={this.state.promoItems} numColumns={2} renderPlaceholder={(i)=>(<View style={{flex:1, height:60, width:400, backgroundColor:'yellow'}} />)} />
  }
        </View>
      </ImageBackground>

    )
  }


  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;
    return (
      
        <TouchableOpacity style={styles.itemBox} activeOpacity={0.5} onPress={() => navigate('Promo', { screen: 'PromoItemPage', params: { itemIDCallback: item } })} >
          <Image style={styles.itemImage} source={{ uri: item.imageLink }} />
        
          <Text style={styles.itemTitleText}>{item.name}</Text>
        </TouchableOpacity>
  
    )
  }
}

export default PromotionsPage;



const styles = StyleSheet.create({

  fullBackground:
  {
    flex: 1,
    width: "100%"
  },

  promoPageContainer: {
    backgroundColor: "transparent",
    flex: 1,
    alignItems: 'center',

  },
  gridContainer: {
    width: 400,
    marginBottom:60,
    
  },

  promoTitle: {
    marginTop: 40,
    marginBottom: 60,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Segoe UI"
  },

  promoFooter: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#c8e8e4",
    justifyContent: "space-around",
  },

  

  itemBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 20,
    flex: 1,
    maxWidth: 180,
    maxHeight:160,
  },

  itemTitleText: {
    textAlign: "center",
    marginBottom: 5,
    fontFamily: 'Segoe UI'
  },

  

  itemImage: {
    marginTop: 5,
    marginBottom: 0,
    flex: 1,
    width: 100,
    height: 100,
    borderRadius: 10,
  }

});