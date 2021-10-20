import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Item from '../Models/ItemModels/Item';
import SwipeableItem from '../Components/SwipeableItem';
import auth from '@react-native-firebase/auth';

import Ticker, {Tick} from 'react-native-ticker';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import globalStyles from '../Styles/globalStyles';

function CartPage() {
  const [cartItems, setCartItems] = React.useState<Item[]>([]);
  const [isScrollEnabled, setScrollEnabled] = React.useState(true);
  const [cartSum, setCartSum] = React.useState<number[]>([0, 0, 0]);
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('cart side', isScrollEnabled);
  }, [isScrollEnabled]);

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
        Math.round(100 * 0.0825 * tempSum) / 100,
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
      deleteItem={deleteItem}
      sourcePage="Cart"
      navigation={navigation}
    />
  );

  return (
    <View style={globalStyles.fullBackground}>
      <View style={styles.blueHeaderContainer}>
        <View style={styles.blueHeader}>
          <View
            style={{flexDirection: 'column', marginTop: 15, marginLeft: 30}}>
            {cartSum ? (
              <View style={{flexDirection: 'row'}}>
                <Ticker
                  textStyle={{fontSize: 30, fontWeight: 'bold', color: 'white'}}
                  duration={500}>
                  ${Math.trunc(cartSum[2]).toString() || 0}
                </Ticker>
                <Ticker
                  duration={250}
                  textStyle={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  {(cartSum[2] - Math.trunc(cartSum[2]))
                    .toString()
                    .slice(1, 4) || 0}
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
      </View>

      <FlatList
        contentContainerStyle={{
          alignItems: 'center',
          marginBottom: 20,
          paddingTop: 5,
        }}
        style={styles.flatContainer}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        data={cartItems}
      />
      <View
        style={{
          height: 200,
          width: '100%',
          flexDirection: 'column',
          marginBottom: 60,
          borderTopWidth: 1,
          borderColor: '#E6E6E6',
        }}>
        <View
          style={{
            height: '60%',
            width: '100%',
            flexDirection: 'column',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            <Text style={styles.totalTitles}>{'  '}Subtotal</Text>
            <Text style={styles.totalNumbersText}>${cartSum[0]}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              borderBottomWidth: 1,
              borderColor: '#E6E6E6',
            }}>
            <Text style={styles.totalTitles}>{'  '}Tax</Text>
            <Text style={styles.totalNumbersText}>+${cartSum[1]}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            <Text style={styles.totalTitles}>{'  '}Total</Text>
            <Text style={styles.totalNumbersText}>${cartSum[2]}</Text>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            height: '30%',
            // backgroundColor: 'purple',
          }}>
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
    </View>
  );
}

const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

export default CartPage;

const styles = StyleSheet.create({
  blueHeader: {
    flexDirection: 'row',
    backgroundColor: '#0073FE',
    borderRadius: 10,
  },
  blueHeaderContainer: {
    width: '100%',
    height: '12%',
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    marginTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },

  flatContainer: {
    width: '100%',
  },

  checkOutButton: {
    alignSelf: 'center',
    width: '50%',
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

  totalTitles: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 8,
    flex: 1,
  },

  totalNumbersText: {
    textAlign: 'right',
    fontSize: 16,
    marginHorizontal: 20,
    marginVertical: 5,
    flex: 1,
  },
});
