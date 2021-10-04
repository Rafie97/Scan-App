import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Item from '../Models/Item';
import SwipeableItem from '../Components/SwipeableItem';
import auth from '@react-native-firebase/auth';

import Ticker, {Tick} from 'react-native-ticker';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

function CartPage() {
  const [cartItems, setCartItems] = React.useState<Item[]>([]);
  const [isScrollEnabled, setScrollEnabled] = React.useState(true);
  const [cartSum, setCartSum] = React.useState<number[]>(undefined);
  const navigation = useNavigation();

  React.useEffect(() => {
    const userID = auth().currentUser.uid;
    const cartRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Cart');

    const sub = cartRef.onSnapshot(snap => {
      setCartItems([]);
      const tempItems: Item[] = [];
      snap.forEach(async doc => {
        const item = new Item(doc);
        item.quantity = doc.data().quantity;
        tempItems.push(item);
      });
      setCartItems(tempItems);
    });

    return () => sub();
  }, []);

  React.useEffect(() => {
    let tempSum = 0;
    cartItems.forEach(item => {
      const numPrice = +item.price;
      tempSum += numPrice;
    });
    if (tempSum > 0) {
      setCartSum([
        Math.round(100 * tempSum) / 100,
        Math.round(100 * 1.0825 * tempSum) / 100,
      ]);
    }
  }, [cartItems]);

  function deleteItem(itemID) {
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

  // function getTotalPriceString(price) {
  //   const totalNum = Math.round(100 * 1.0825 * price) / 100;
  //   const totalString = totalNum.toString();
  //   console.log('in func ', totalString);
  //   // return totalString;
  //   return totalNum;
  // }

  const renderItem = ({item}) => (
    <SwipeableItem
      item={item}
      setScrollEnabled={enable => setScrollEnabled(enable)}
      deleteItem={deleteItem}
      sourcePage="Cart"
      navigation={navigation}
    />
  );

  return (
    <View style={styles.fullBackground}>
      <View style={styles.TotalPricesView}>
        <View style={{flexDirection: 'column', marginTop: 15, marginLeft: 30}}>
          {cartSum ? (
            <View style={{flexDirection: 'row'}}>
              <Ticker
                textStyle={{fontSize: 30, fontWeight: 'bold', color: 'white'}}
                duration={500}>
                ${Math.trunc(cartSum[1]).toString() || 0}
              </Ticker>
              <Ticker
                duration={250}
                textStyle={{fontSize: 30, fontWeight: 'bold', color: 'white'}}>
                {(cartSum[1] - Math.trunc(cartSum[1])).toString().slice(1, 4) ||
                  0}
              </Ticker>
            </View>
          ) : (
            <></>
          )}
          <Text style={{color: 'white'}}>Total Balance</Text>
        </View>
        <TouchableOpacity
          style={{width: '200%', height: '100%', justifyContent: 'center'}}>
          <View
            style={{
              width: 115,
              height: 40,
              backgroundColor: 'white',
              borderRadius: 10,
              alignSelf: 'flex-end',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#0073FE',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Check Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.TaxTotal}>
        {' '}
        <B>${cartSum ? cartSum[0] : 0}</B> without tax
      </Text> */}

      <TouchableOpacity
        style={{margin: 15, position: 'relative', top: 0, right: 0}}>
        <Text style={{color: 'blue', right: 0, position: 'relative'}}>
          About this store
        </Text>
      </TouchableOpacity>

      <FlatList
        scrollEnabled={isScrollEnabled}
        contentContainerStyle={{alignItems: 'center', marginBottom: 80}}
        style={styles.flatContainer}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        data={cartItems}
      />

      <View style={{width: '50%'}}>
        <TouchableOpacity
          style={styles.checkOutButton}
          onPress={() => {
            return;
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
            }}>
            Check out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

export default CartPage;

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fafafa',
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
  },
  checkOutButton: {
    marginBottom: 80,
    backgroundColor: '#0073FE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 1,
    shadowRadius: 9.11,
    padding: 15,
    elevation: 20,
    // borderWidth: 2,
    borderRadius: 40,
    // borderColor: 'white',
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
  },
  itemPrice: {
    alignSelf: 'center',
    textAlign: 'right',
    marginLeft: 'auto',
    marginRight: 10,
  },

  TotalPricesView: {
    width: '90%',
    height: '12%',
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#0073FE',
    borderRadius: 10,
  },

  FirstTotal: {
    fontSize: 40,
  },

  TaxTotal: {
    alignSelf: 'center',
    fontSize: 16,
  },
});
