import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {TouchableOpacity, FlatList} from 'react-native-gesture-handler';
import SwipeableItem from '../../Components/SwipeableItem';
import auth from '@react-native-firebase/auth';
import Ticker from 'react-native-ticker';
import {useIsFocused} from '@react-navigation/native';
import gs from '../../Styles/globalStyles';
import {useDispatch, useStore} from '../../Reducers/store';
import useAuth from '../../Auth_Components/AuthContext';
import BottomCartInfo from './CartComponents/BottomCartInfo';

function CartPage() {
  const [isScrollEnabled, setScrollEnabled] = useState<boolean>(true);
  const [cartSum, setCartSum] = useState<number[] | undefined>(undefined);

  const store = useStore();
  const authh = useAuth();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const cartItems = store.user ? store.user.cart : [];

  React.useEffect(() => {
    if (store.user === null && isFocused && authh.isAnonymous) {
      dispatch({type: 'SET_LOGIN_MODAL', payload: true});
    }
  }, [isFocused, store.user, authh.isAnonymous, dispatch]);

  React.useEffect(() => {
    if (!cartItems) return;
    let tempSum = 0;
    cartItems.forEach(item => {
      const numPrice = +item.price * item.quantity;
      tempSum += numPrice;
    });
    if (tempSum > 0) {
      setCartSum([
        Math.round(100 * tempSum) / 100,
        Math.round(100 * 0.0825 * tempSum) / 100,
        Math.round(100 * 1.0825 * tempSum) / 100
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
        console.warn('Error deleting from cart: ', err);
      });
  }

  function getTickerTens(): string {
    const sum =
      cartSum && cartSum.length ? Math.trunc(cartSum[2]).toString() : '00';
    console.log('sum: ', sum);
    return sum;
  }

  function getTickerTenths(): string {
    return cartSum && cartSum.length
      ? (cartSum[2] - Math.trunc(cartSum[2]))
          .toFixed(2)
          .toString()
          .slice(1, 4)
      : '00';
  }

  return (
    <View style={gs.fullBackground}>
      <View style={styles.blueHeaderContainer}>
        <View style={styles.blueHeader}>
          <View style={styles.totalBalanceView}>
            <View style={gs.flexRow}>
              <Ticker textStyle={styles.tickerText} duration={500}>
                ${getTickerTens()}
              </Ticker>
              <Ticker duration={250} textStyle={styles.tickerText}>
                {getTickerTenths()}
              </Ticker>
            </View>
            <Text style={gs.white}>Total Balance</Text>
          </View>
          <TouchableOpacity
            onPress={() => {}}
            style={[gs.width100, gs.height100, gs.jCenter]}>
            <View style={styles.topCheckoutView}>
              <Text style={[gs.blue, gs.bold, gs.taCenter]}>Checkout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        // scrollEnabled={isScrollEnabled}
        style={gs.width100}
        renderItem={({item}) => (
          <SwipeableItem
            item={item}
            deleteItem={deleteItem}
            sourcePage="Cart"
            // setOuterScrollEnabled={setScrollEnabled}
          />
        )}
      />
      <BottomCartInfo cartSum={cartSum} />
    </View>
  );
}

export default CartPage;

const styles = StyleSheet.create({
  blueHeader: {
    borderRadius: 10,
    justifyContent: 'space-between',
    ...gs.bgBlue,
    ...gs.flexRow
  },
  blueHeaderContainer: {
    height: '12%',
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    marginTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    ...gs.width100
  },

  totalBalanceView: {
    marginVertical: 'auto',
    marginLeft: 30,
    ...gs.flexColumn
  },

  topCheckoutView: {
    width: 115,
    height: 40,
    ...gs.bgWhite,
    ...gs.jCenter,
    ...gs.margin20,
    ...gs.radius10
  },

  tickerText: {
    fontSize: 30,
    ...gs.bold,
    ...gs.white,
    ...gs.taCenter
  },

  listContainer: {
    paddingTop: 10,
    marginBottom: 10,
    ...gs.aCenter
  }
});
