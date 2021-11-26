import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Item from '../../Models/ItemModels/Item';
import SwipeableItem from '../../Components/SwipeableItem';
import auth from '@react-native-firebase/auth';
import Ionicon from 'react-native-vector-icons/Ionicons';
import gs from '../../Styles/globalStyles';
import {useNavigation} from '@react-navigation/core';

function EditWishlistPage(props: any) {
  const [listItems, setListItems] = React.useState<Item[]>([]);
  const navigation = useNavigation();
  const routeListName = props.route.params.listNameCallback;

  React.useEffect(() => {
    getItems();
  }, []);

  async function getItems(): Promise<void> {
    const userID = auth().currentUser.uid;
    const wishRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists')
      .doc(routeListName)
      .collection('items');

    await wishRef.onSnapshot(snap => {
      const tempItems: Item[] = [];
      setListItems([]);
      snap.forEach(doc => {
        const item = new Item(doc);
        tempItems.push(item);
      });
      setListItems(tempItems);
    });
  }

  function deleteItem(itemID) {
    const userID = auth().currentUser.uid;
    const cartRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists')
      .doc(routeListName)
      .collection('items');

    cartRef
      .doc(itemID)
      .delete()
      .then(() => {
        console.log('Successfully deleted from wishlist');
      })
      .catch(err => {
        console.log('Error removing from list: ', err);
      });
  }

  const renderItem = ({item}) => (
    <SwipeableItem
      item={item}
      deleteItem={deleteItem}
      sourcePage="Account"
      navigation={navigation}
    />
  );

  return (
    <View style={gs.fullBackground}>
      <View style={styles.backButtonView}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => navigation.navigate('AccountPage')}>
          <Ionicon
            name="arrow-back-circle-outline"
            size={50}
            style={{marginLeft: 10, marginTop: 5}}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.ListNameText}>{routeListName}</Text>
      <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
        <View style={styles.wishlistGroupView}>
          <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={listItems}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  );
}

export default EditWishlistPage;

const styles = StyleSheet.create({
  wishlistGroupView: {
    padding: 30,
    paddingTop: 20,
  },
  wishlistButton: {
    opacity: 100,
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 20,
    flex: 1,
  },
  backButtonView: {
    justifyContent: 'center',
    alignContent: 'center',
    width: 150,
    alignSelf: 'flex-start',
  },
  gridContainer: {
    flex: 1,
  },
  ListNameText: {
    fontSize: 40,
    textAlign: 'center',
    paddingTop: 60,
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
});
