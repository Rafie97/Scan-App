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
import {useStore} from '../../Reducers/store';

function EditWishlistPage(props: any) {
  const [listItems, setListItems] = React.useState<Item[]>([]);
  const store = useStore();
  const navigation = useNavigation();
  const routeListName = props.route.params.listNameCallback;
  const wishlists = store.user.wishlists;

  React.useEffect(() => {
    if (wishlists.length) {
      const wishIndex = wishlists.findIndex(list => list.id === routeListName);
      let tempItems: Item[] = [];
      wishlists[wishIndex].items.forEach((id: string) => {
        tempItems.push(store.items.find(itm => itm.docID === id));
      });
      setListItems(
        tempItems.map(itm => {
          return {...itm, quantity: 1};
        }),
      );
    }
  }, [wishlists]);

  function deleteItem(itemID) {
    const userID = auth().currentUser.uid;
    firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists')
      .doc(routeListName)
      .update({
        items: firestore.FieldValue.arrayRemove(itemID),
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
          style={gs.flexRow}
          onPress={() =>
            navigation.navigate('Account', {screen: 'AccountPage'})
          }>
          <Ionicon name="arrow-back-circle-outline" size={45} />
        </TouchableOpacity>
      </View>
      <Text style={styles.listNameText}>{routeListName}</Text>
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        data={listItems}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        style={gs.width100}
      />
    </View>
  );
}

export default EditWishlistPage;

const styles = {
  backButtonView: {
    top: 5,
    left: 0.25,
    padding: 4.75,
    ...gs.aCenter,
    ...gs.jCenter,
    ...gs.pAbsolute,
  },
  listNameText: {
    fontSize: 24,
    maxWidth: '80%',
    alignSelf: 'flex-end',
    marginLeft: 60,
    paddingRight: 40,
    ...gs.aStretch,
    ...gs.bold,
    ...gs.margin20,
    ...gs.taCenter,
  },
  listContainer: {
    paddingTop: 5,
    marginBottom: 10,
    ...gs.aCenter,
    ...gs.height100,
  },
};
