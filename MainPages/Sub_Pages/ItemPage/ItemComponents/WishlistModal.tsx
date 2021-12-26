import React from 'react';
import {FlatList, Modal, TouchableOpacity, View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import gs from '../../../../Styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

type WishlistModalProps = {
  itemID: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  wishlists: string[];
};

export default function WishlistModal({
  itemID,
  visible,
  setVisible,
  wishlists,
}: WishlistModalProps) {
  const navigation = useNavigation();

  function addToWishlist(listname) {
    const userID = auth().currentUser.uid;

    firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists')
      .doc(listname)
      .update({
        items: firestore.FieldValue.arrayUnion(itemID),
      });

    setVisible(false);

    navigation.navigate('Account', {
      screen: 'EditWishlistPage',
      params: {listNameCallback: listname},
    });
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select a wishlist for this item</Text>

          <FlatList
            data={wishlists}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.wishlistSelect}
                onPress={() => addToWishlist(item)}>
                <Text style={[gs.taCenter, gs.white]}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.cancelView}
            onPress={() => setVisible(false)}>
            <Text style={[gs.taCenter, gs.white]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  centeredView: {
    // ...gs.aCenter,
    ...gs.flex1,
    ...gs.jCenter,
  },
  modalView: {
    height: 350,
    ...gs.aCenter,
    ...gs.bgWhite,
    ...gs.margin20,
    ...gs.padding20,
    ...gs.radius10,
    ...gs.shadow,
  },

  modalTitle: {
    ...gs.aStretch,
    ...gs.bold,
    ...gs.taCenter,
  },

  wishlistSelect: {
    marginTop: 20,
    height: 40,
    width: 200,
    ...gs.bgBlue,
    ...gs.taCenter,
    ...gs.jCenter,
    ...gs.radius10,
  },

  cancelView: {
    width: 80,
    height: 40,
    ...gs.bgPurple,
    ...gs.jCenter,
    ...gs.radius10,
  },
};
