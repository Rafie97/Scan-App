import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import Grid from 'react-native-grid-component';
import firestore from '@react-native-firebase/firestore';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Item, {itemConverter} from '../Models/Item';
import SwipeableItem from '../Models/Components/SwipeableItem';
import auth from '@react-native-firebase/auth';
import {Button} from 'react-native-paper';
import styled from 'styled-components/native';
import {BlurView} from 'react-native-blur';

const StyledBlurView = styled(BlurView)`
  height: 80px;
`;
const Container = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;
const Content = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

class CartPage extends Component {
  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
    this.state = {
      cartItems: [],
      isScrollEnabled: true,
    };
    this.setScrollEnabled = this.setScrollEnabled.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount() {
    const userID = auth().currentUser.uid;
    const cartRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Cart');

    const sub = cartRef.onSnapshot(snap => {
      this.setState({cartItems: []});
      snap.forEach(async doc => {
        const item = new Item(doc);
        await this.setState({cartItems: [...this.state.cartItems, item]});
      });
    });
    return () => sub();
  }

  deleteItem(itemID) {
    const userID = auth().currentUser.uid;
    const cartRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Cart');

    cartRef
      .doc(itemID)
      .delete()
      .then(() => {
        console.log('Successfully deleted from cart');
      })
      .catch(err => {
        console.log('Error deleting from cart: ', err);
      });
  }

  render() {
    let cartSum = 0;
    this.state.cartItems.forEach(item => {
      const numPrice = +item.price;
      cartSum += numPrice;
    });
    cartSum = Math.round(100 * cartSum) / 100;

    return (
      <ImageBackground
        source={require('../res/android-promotions.png')}
        style={styles.fullBackground}>
        <View style={styles.TotalPricesView}>
          <Text style={styles.FirstTotal}>
            Total : ${Math.round(100 * 1.0825 * cartSum) / 100}
          </Text>
          <Text style={styles.TaxTotal}> ${cartSum} before tax</Text>
        </View>
        <TouchableOpacity
          style={{margin: 15, position: 'relative', top: 0, right: 0}}>
          <Text style={{color: 'blue', right: 0, position: 'relative'}}>
            About this store
          </Text>
        </TouchableOpacity>

        <FlatList
          scrollEnabled={this.state.isScrollEnabled}
          contentContainerStyle={{alignItems: 'center', marginBottom: 80}}
          style={styles.flatContainer}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          data={this.state.cartItems}
        />
        <Blur />
        <View style={{position: 'absolute', right: 0, bottom: 0}}>
          <TouchableOpacity
            style={styles.checkOutButton}
            onPress={() => {
              return;
            }}>
            <Text
              style={{
                fontFamily: 'Segoe UI',
                fontSize: 20,
                fontVariant: ['small-caps'],
                color: 'purple',
              }}>
              Check out
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  setScrollEnabled(enable) {
    this.setState({
      isScrollEnabled: enable,
    });
  }

  renderItem = ({item}) => (
    <SwipeableItem
      item={item}
      setScrollEnabled={enable => this.setScrollEnabled(enable)}
      deleteItem={this.deleteItem}
      sourcePage="Cart"
      navigation={this.props.navigation}
    />
  );
}
function Blur() {
  return (
    <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
      <BlurView
        blurRadius={25}
        overlayColor=""
        blurAmount={3}
        blurType="dark"
        style={{height: 80, backgroundColor: 'yellow'}}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 400,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          left: 0,
        }}>
        <Text>BLUR THIS</Text>
      </View>
    </View>
  );
}

export default CartPage;

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  flatContainer: {
    marginTop: 30,
    flex: 1,
    width: '100%',
    marginBottom: 60,
  },

  YourCartText: {
    fontSize: 24,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 60,
    fontFamily: 'Segoe UI',
  },
  checkOutButton: {
    marginBottom: 80,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    padding: 4,
    elevation: 14,
    borderWidth: 2,
    borderRadius: 100,
  },

  itemBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 20,
    flexDirection: 'row',
    width: 300,
    height: 60,
    marginTop: 20,
  },
  itemImage: {
    alignSelf: 'center',
    width: 45,
    height: 45,
    marginLeft: 10,
    marginRight: 0,
    borderRadius: 10,
    borderWidth: 10,
  },
  itemLabel: {
    alignSelf: 'center',
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Segoe UI',
  },
  itemPrice: {
    alignSelf: 'center',
    textAlign: 'right',
    marginLeft: 'auto',
    marginRight: 10,
  },

  TotalPricesView: {
    alignSelf: 'center',
    marginRight: 10,
    marginTop: 30,
  },

  FirstTotal: {
    alignSelf: 'flex-end',
    fontSize: 30,
    fontFamily: 'Segoe UI',
    fontWeight: 'bold',
    fontVariant: ['small-caps'],

    marginBottom: 10,
  },

  TaxTotal: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: 'Segoe UI',
  },
});
