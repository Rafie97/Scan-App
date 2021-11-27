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

  React.useEffect(() => {
    getItems();
  });

  async function getItems(): Promise<void> {
    const userID = auth().currentUser.uid;
    firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists')
      .doc(routeListName)
      .get()
      .then(doc => {
        if (doc.exists) {
          let tempItems: Item[] = [];
          doc.data().items.forEach((id: string) => {
            tempItems.push(store.items.find(itm => itm.docID === id));
          });
          setListItems(tempItems);
        } else {
          console.log('No such document!');
        }
      });
  }

  function deleteItem(itemID) {
    const userID = auth().currentUser.uid;
    firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists')
      .doc(routeListName)
      .update({
        items: firestore.FieldValue.arrayRemove(itemID),
      })
      .then(() => {
        getItems();
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
    top: 10,
    left: 5,
    ...gs.aCenter,
    ...gs.jCenter,
    ...gs.pAbsolute,
  },
  listNameText: {
    fontSize: 24,
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
