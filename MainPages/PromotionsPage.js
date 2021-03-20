import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import Grid from 'react-native-grid-component';
import firestore from '@react-native-firebase/firestore';
import Item from '../Models/Item';
import FamilyTile from '../Models/Components/FamilyTile';
import {BlurView} from 'react-native-blur';

class PromotionsPage extends Component {
  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
    this.state = {
      loading: true,
      promoItems: [],
    };

    this.getItems = this.getItems.bind(this);
  }

  componentDidMount() {
    this.getItems();
  }

  async getItems() {
    const hebRef = firestore()
      .collection('stores')
      .doc('HEB')
      .collection('items');

    hebRef.onSnapshot(snap => {
      this.setState({promoItems: []});
      snap.forEach(async doc => {
        const item = new Item(doc);
        await this.setState({promoItems: [...this.state.promoItems, item]});
      });
    });
  }

  render() {
    // let arr = [];
    // this.state.promoItems.forEach(i => {
    //   arr = [...arr, i.name];
    // });

    return (
      <ImageBackground
        source={require('../res/grad_3.png')}
        style={styles.fullBackground}>
        <ScrollView style={styles.promoPageContainer}>
          <Text style={styles.promoTitle}>Today's Best Deals</Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: 20,
              marginBottom: 10,
            }}>
            Explore our coupons
          </Text>
          <View style={{height: 300}}>
            <FlatList
              data={this.state.promoItems}
              horizontal={true}
              renderItem={this.renderItem}
            />
          </View>
          <View style={{height: 20}} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: 20,
              marginBottom: 10,
            }}>
            Explore our combos and recipes
          </Text>
          <View style={{height: 160}}>
            <FlatList
              data={[
                {
                  name: 'Spicy Ramen Combo',
                  image: '../../res/Spicy-Chicken-Ramen-28-scaled.jpg',
                },
                {
                  name: 'Spring Combos',
                  image: '../../res/Spicy-Chicken-Ramen-28-scaled.jpg',
                },
                {
                  name: 'Grill Combos',
                  image: '../../res/Spicy-Chicken-Ramen-28-scaled.jpg',
                },
                {
                  name: 'Taco Combos',
                  image: '../../res/Spicy-Chicken-Ramen-28-scaled.jpg',
                },
              ]}
              horizontal={true}
              renderItem={({item}) => (
                <View
                  style={{
                    height: 130,
                    width: 100,
                    marginLeft: 10,
                    alignItems: 'flex-end',
                  }}>
                  <Image
                    source={{uri: item.image}}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      borderColor: '#dddddd',
                      borderWidth: 2,
                      marginLeft: 10,
                    }}
                  />

                  <View
                    style={{flex: 1, paddingTop: 10, alignSelf: 'flex-start'}}>
                    <Text style={{fontFamily: 'Segoe UI'}}>{item.name}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  renderItem = ({item}) => {
    const {navigate} = this.props.navigation;
    return (
      <TouchableOpacity
        style={styles.itemBox}
        activeOpacity={0.5}
        onPress={() =>
          navigate('Promo', {
            screen: 'PromoItemPage',
            params: {itemIDCallback: item},
          })
        }>
        <Image style={styles.itemImage} source={{uri: item.imageLink}} />

        <Text style={[styles.itemTitleText, {fontWeight: 'bold'}]}>
          ${item.price}
        </Text>

        <Text style={styles.itemTitleText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
}

export default PromotionsPage;

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
  },

  promoPageContainer: {
    width: '100%',
    height: '100%',
    marginBottom: 60,
  },
  gridContainer: {
    width: 400,
    marginBottom: 60,
  },

  promoTitle: {
    marginTop: 40,
    marginBottom: 60,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Segoe UI',
  },

  promoFooter: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#c8e8e4',
    justifyContent: 'space-around',
  },

  itemBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 20,
    marginHorizontal: 10,
    width: 200,
    maxHeight: 360,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },

  itemTitleText: {
    textAlign: 'left',
    marginVertical: 5,
    marginLeft: 20,
    fontSize: 20,
    fontFamily: 'Segoe UI',
  },

  itemImage: {
    marginTop: 5,
    marginBottom: 20,
    marginHorizontal: 5,
    borderRadius: 2,
    top: 0,
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
