import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Item from '../../Models/ItemModels/Item';
import SwipeableItem from '../../Components/SwipeableItem';
import auth from '@react-native-firebase/auth';
import Ionicon from 'react-native-vector-icons/Ionicons';
import gs from '../../Styles/globalStyles';
import {useNavigation} from '@react-navigation/core';
import {useStore} from '../../Reducers/store';
import ItemBubble from '../../Components/ItemBubble';

function EditWishlistPage(props: any) {
  const [listItems, setListItems] = useState<Item[]>([]);
  const store = useStore();
  const navigation = useNavigation();
  const routeListName = props.route.params.listNameCallback;
  const wishlists = store.user.wishlists;

  useEffect(() => {
    if (wishlists.length) {
      let wishIndex = wishlists.findIndex(list => list.id === routeListName);

      let tempItems: Item[] = [];
      wishlists[wishIndex].items.forEach((id: string) => {
        let tempItem = store.items.find(itm => itm.docID === id);
        let isRecipe = false;
        if (!tempItem) {
          tempItem = store.recipes.find(itm => itm.docID === id);
          isRecipe = true;
        }
        tempItems.push({...tempItem, quantity: 1, isRecipe: isRecipe});
      });
      setListItems(tempItems);
    }
  }, [routeListName, store.items, store.recipes, wishlists]);

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
    <SwipeableItem item={item} deleteItem={deleteItem} sourcePage="Account" />
  );

  const renderSkeleton = () => <ItemBubble navToItem={() => {}} />;

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
      {listItems.length ? (
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          data={listItems}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          style={gs.width100}
        />
      ) : (
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          data={[1, 2, 3]}
          renderItem={renderSkeleton}
          contentContainerStyle={styles.listContainer}
          style={gs.width100}
        />
      )}
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
