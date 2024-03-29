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
import BottomCartInfo from '../Cart/CartComponents/BottomCartInfo';
import ItemBubble from '../../Components/ItemBubble';

type Props = {
  receiptId: string;
};

function ReceiptPage({receiptId}: Props) {
  // const [isScrollEnabled, setScrollEnabled] = React.useState(true);S
  const [cartSum, setCartSum] = React.useState<number[]>([0, 0, 0]);

  const navigation = useNavigation();
  const store = useStore();
  const authh = useAuth();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const receipt = store.user.receipts.find(receipt => receipt.id === receiptId);
  const receiptItems = receipt.items.map(itemId => {
    return store.items.find(item => item.docID === itemId);
  });

  React.useEffect(() => {
    if (store.user === null && isFocused && authh.isAnonymous) {
      dispatch({type: 'SET_LOGIN_MODAL', payload: true});
    }
  }, [isFocused, store.user]);

  React.useEffect(() => {
    let tempSum = 0;
    receiptItems.forEach(item => {
      tempSum += item.price;
    });
    if (tempSum > 0) {
      setCartSum([
        Math.round(100 * tempSum) / 100,
        Math.round(100 * 0.0825 * tempSum) / 100,
        Math.round(100 * 1.0825 * tempSum) / 100,
      ]);
    }
  }, [receipt]);

  function deleteItem(itemID) {
    console.warn('Error deleting from receipt');
  }

  return (
    <View style={gs.fullBackground}>
      <View style={styles.blueHeaderContainer}>
        <View style={styles.blueHeader}>
          <View style={styles.totalBalanceView}>
            <View style={gs.flexRow}>
              <Text style={styles.tickerText}>${receipt.amount}</Text>
            </View>

            <Text style={gs.white}>Amount Paid</Text>
          </View>
          <TouchableOpacity
            onPress={() => {}}
            style={[gs.width100, gs.height100, gs.jCenter]}>
            <View style={styles.topCheckoutView}>
              <Text style={[gs.blue, gs.bold, gs.taCenter]}>Buy again</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        style={gs.width100}
        renderItem={({item}) => (
          <ItemBubble item={item} navToItem={() => {}} inCart={false} />
        )}
        data={receiptItems}
      />
      <BottomCartInfo isReceipt={true} cartSum={cartSum} />
    </View>
  );
}

const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

export default ReceiptPage;

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
    width: 100,
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
    ...gs.width100,
  },

  listContainer: {
    paddingTop: 5,
    marginBottom: 10,
    ...gs.aCenter,
    ...gs.height100,
  },
});
