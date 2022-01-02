import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import SwipeableItem from '../../Components/SwipeableItem';
import auth from '@react-native-firebase/auth';
import Ticker from 'react-native-ticker';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import gs from '../../Styles/globalStyles';
import {useDispatch, useStore} from '../../Reducers/store';
import useAuth from '../../Auth_Components/AuthContext';
import BottomCartInfo from './CartComponents/BottomCartInfo';

function CartPage() {
  // const [isScrollEnabled, setScrollEnabled] = React.useState(true);S
  const [cartSum, setCartSum] = React.useState<number[]>([0, 0, 0]);

  const navigation = useNavigation();
  const store = useStore();
  const authh = useAuth();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const cartItems = store.user.cart;

  React.useEffect(() => {
    if (store.user === null && isFocused && authh.isAnonymous) {
      dispatch({type: 'SET_LOGIN_MODAL', payload: true});
    }
  }, [isFocused, store.user]);

  React.useEffect(() => {
    let tempSum = 0;
    cartItems.forEach(item => {
      const numPrice = +item.price * item.quantity;
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
        console.warn('Error deleting from cart: ', err);
      });
  }

  return (
    <View style={gs.fullBackground}>
      <View style={styles.blueHeaderContainer}>
        <View style={styles.blueHeader}>
          <View style={styles.totalBalanceView}>
            {cartSum ? (
              <View style={gs.flexRow}>
                <Ticker textStyle={styles.tickerText} duration={500}>
                  ${Math.trunc(cartSum[2]).toString() || 0}
                </Ticker>
                <Ticker duration={250} textStyle={styles.tickerText}>
                  {(cartSum[2] - Math.trunc(cartSum[2]))
                    .toFixed(2)
                    .toString()
                    .slice(1, 4) || 0}
                </Ticker>
              </View>
            ) : (
              <></>
            )}
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
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        style={gs.width100}
        renderItem={({item}) => (
          <SwipeableItem
            item={item}
            deleteItem={deleteItem}
            sourcePage="Cart"
            navigation={navigation}
          />
        )}
        data={cartItems}
      />
      <BottomCartInfo cartSum={cartSum} />
    </View>
  );
}

export default CartPage;

const styles = StyleSheet.create({
  blueHeader: {
    flexDirection: 'row',
    backgroundColor: '#0073FE',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  blueHeaderContainer: {
    height: '12%',
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    marginTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    ...gs.width100,
  },

  totalBalanceView: {
    marginTop: 15,
    marginLeft: 30,
    ...gs.flexColumn,
  },

  topCheckoutView: {
    width: 115,
    height: 40,
    ...gs.bgWhite,
    ...gs.jCenter,
    ...gs.margin20,
    ...gs.radius10,
  },

  tickerText: {
    fontSize: 30,
    ...gs.bold,
    ...gs.white,
    ...gs.taCenter,
  },

  listContainer: {
    paddingTop: 5,
    marginBottom: 10,
    ...gs.aCenter,
    ...gs.height100,
  },
});
