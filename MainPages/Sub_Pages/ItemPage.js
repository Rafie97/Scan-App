import React, {useState, useEffect} from 'react';
import {Button, Card, LinearGradient} from 'react-native-elements';

import Ionicon from 'react-native-vector-icons/Ionicons';
import Ant from 'react-native-vector-icons/AntDesign';
import {
  ImageBackground,
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {LineChart} from 'react-native-charts-wrapper';
import auth from '@react-native-firebase/auth';
import Item from '../../Models/Item';
import globalStyles from '../../Styles/globalStyles';

function ItemPage({route}) {
  const [thing, setThing] = useState(null);
  const [wishlistModal, setWishlistModal] = useState(false);
  const [wishlists, setWishlists] = useState([]);

  const navigate = useNavigation();

  React.useEffect(() => {
    setThing(route.params.itemIDCallback);
  }, [route.params.itemIDCallback]);

  async function getLists() {
    //Retrieve names of wishlists
    const userID = auth().currentUser.uid;
    const wishRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists');
    let lists = [];
    await wishRef.get().then(snap => {
      snap.forEach(doc => {
        const listname = doc.id;
        lists.push(listname);
      });
    });
    await setWishlists(lists);

    setWishlistModal(true);
  }

  function addToCart() {
    const userID = auth().currentUser.uid;
    const cartRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Cart');
    const item = new Item(thing);
    item.quantity = 1;
    cartRef.add(item);
    navigate.navigate('Cart');
  }

  function addToWishlist(listname) {
    const userID = auth().currentUser.uid;
    const wishRef = firestore()
      .collection('users')
      .doc(userID)
      .collection('Wishlists')
      .doc(listname)
      .collection('items');
    const item = new Item(thing);
    wishRef.add(thing);

    navigate.navigate('Account', {
      screen: 'EditWishlistPage',
      params: {listNameCallback: listname},
    });
  }

  let data1 = {
    dataSets: [
      {
        label: 'prices',
        values: null,
        config: {drawValues: false, drawCircles: false, linewidth: 2},
      },
    ],
  };

  let vals = [];

  if (!route.params.isRecipe && thing) {
    const entries = Object.entries(thing.priceHistory);
    entries.forEach(entry => {
      vals.push({
        x: Math.floor(parseFloat(entry[0])),
        y: Math.round(entry[1] * 100),
      });
    });

    data1.dataSets[0].values = vals;
  }
  return (
    <View style={globalStyles.fullBackground}>
      <View style={styles.backButtonView}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => navigate.goBack()}>
          <Ionicon
            name="arrow-back-circle-outline"
            size={50}
            style={{marginLeft: 10, marginTop: 5}}
          />
        </TouchableOpacity>
      </View>

      {!thing ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          <View style={styles.bigApple}>
            <Text style={styles.itemNameText}>{thing.name} </Text>

            <View syle={styles.imageContainer}>
              <Image style={styles.itemImage} source={{uri: thing.imageLink}} />
            </View>
            <Text style={styles.itemPriceText}>${thing.price}</Text>
            {!route.params.isRecipe && (
              <Card style={styles.chartCard} title="Price History">
                <LineChart
                  style={styles.priceChart}
                  data={data1}
                  xAxis={{enabled: false}}
                />
                <Text>Here are the stonks for this item</Text>
              </Card>
            )}

            <Text style={styles.reviewText}>Reviews</Text>
            <View style={styles.reviewBox} />

            <TouchableOpacity
              style={styles.bottomButtons}
              title="Add to Wishlist"
              onPress={getLists}>
              <Text style={styles.addButtonText}> Add to Wishlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomButtons}
              title="Add to Cart"
              onPress={addToCart}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>

            <View style={{height: 60}} />
          </View>
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={wishlistModal}
        onRequestClose={() => setWishlistModal(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Which wishlist would you like to add it to?
            </Text>

            <FlatList
              data={wishlists}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.wishlistSelect}
                  onPress={() => addToWishlist(item)}>
                  <Text style={styles.title}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={{
                width: 80,
                height: 40,
                borderWidth: 1,
                justifyContent: 'center',
              }}
              onPress={() => setWishlistModal(false)}>
              <Text style={styles.title}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ItemPage;

const styles = StyleSheet.create({
  addButtonText: {
    color: 'white',
    fontSize: 18,
    alignSelf: 'center',
  },

  bigApple: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtons: {
    marginBottom: 20,
    marginTop: 20,
    width: 200,
    height: 60,
    backgroundColor: '#0073FE',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
  },

  backButton: {
    flex: 1,
  },
  backButtonView: {
    justifyContent: 'center',
    alignContent: 'center',
    width: 100,
    alignSelf: 'flex-start',
  },
  chartCard: {
    width: 400,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  imageContainer: {
    backgroundColor: 'yellow',
    marginBottom: 50,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    borderWidth: 1,
  },

  itemImage: {
    width: 150,
    height: 150,
  },
  itemNameText: {
    fontSize: 30,
    paddingBottom: 50,
  },
  itemPriceText: {
    fontSize: 35,
    paddingBottom: 50,
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 350,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  priceChart: {
    height: 250,
    width: 350,
  },

  reviewText: {
    fontSize: 24,
    color: 'green',
    marginTop: 50,
  },

  reviewBox: {
    borderWidth: 1,
    borderColor: 'green',
    width: 300,
    height: 200,
    marginTop: 20,
    marginBottom: 30,
  },

  wishlistSelect: {
    backgroundColor: '#5cbcc9',
    padding: 0,
    marginTop: 20,
    height: 40,
    width: 200,
    textAlign: 'center',
    justifyContent: 'center',
  },
});
