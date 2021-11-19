import React, {useState, useEffect} from 'react';
import {Card} from 'react-native-elements';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {
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
import {LineChart} from 'react-native-chart-kit';
import auth from '@react-native-firebase/auth';
import Item from '../../../Models/ItemModels/Item';
import gs from '../../../Styles/globalStyles';
import PriceChart from './ItemComponents/PriceChart';
import ReviewCard from './ItemComponents/ReviewCard';

export type LineChartDataType = {
  labels: string[];
  datasets: [
    {
      data: number[];
    }
  ];
};

type ItemPageParams = {
  route: {
    params: {
      itemIDCallback: Item;
      isRecipe: boolean;
    };
  };
};

function ItemPage({route}: ItemPageParams) {
  const [thing, setThing] = useState<Item>();
  const [wishlistModal, setWishlistModal] = useState(false);
  const [wishlists, setWishlists] = useState([]);
  const [lineChartData, setLineChartData] = useState<LineChartDataType>({
    labels: [],
    datasets: [{data: []}],
  });

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
    //@ts-ignore
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

  useEffect(() => {
    let vals = [];
    let labels = [];
    if (!route.params.isRecipe && thing) {
      let i = 0;
      thing.priceHistory.forEach((value, key) => {
        if (i < 40) {
          i++;
          const val = Math.round(value * 100) / 100;
          const label = Math.floor(parseFloat(key) / 100000) / 10;
          vals.push(val);
          labels.push(`${label}`);
        } else {
          return;
        }
      });

      const dataObj: LineChartDataType = {
        labels: labels.reverse(),
        datasets: [{data: vals.reverse()}],
      };
      setLineChartData(dataObj);

      console.log('LABELS', dataObj.labels);
    }
  }, [route.params.isRecipe, thing]);

  return (
    <View style={gs.fullBackground}>
      <View style={styles.backButtonView}>
        <TouchableOpacity
          style={[{flexDirection: 'row'}]}
          onPress={() => navigate.navigate('Promo', {screen: 'MainPromoPage'})}>
          <Ionicon name="arrow-back-circle-outline" size={45} />
        </TouchableOpacity>
      </View>

      {!!thing && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.bigApple}>
            <Text style={[gs.header, styles.itemNameText]}>{thing.name}</Text>
            <View style={styles.imageContainer}>
              <Image style={styles.itemImage} source={{uri: thing.imageLink}} />
            </View>
            <Text style={styles.itemPriceText}>${thing.price}</Text>
            {!route.params.isRecipe && lineChartData.labels.length ? (
              <PriceChart lineChartData={lineChartData} />
            ) : null}

            <ReviewCard
              reviews={[
                {
                  reviewer: 'Rafa',
                  reviewText: 'I love this product! I use it daily',
                },
                {
                  reviewer: 'Neto',
                  reviewText: 'Please stop screaming',
                },
              ]}
            />

            <TouchableOpacity style={styles.bottomButtons} onPress={getLists}>
              <Text style={styles.addButtonText}> Add to Wishlist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomButtons} onPress={addToCart}>
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
              keyExtractor={(item, index) => `${index}`}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.wishlistSelect}
                  onPress={() => addToWishlist(item)}>
                  <Text>{item}</Text>
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
              <Text>Cancel</Text>
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
    position: 'absolute',
    top: 10,
    left: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  imageContainer: {
    ...gs.radius10,
    ...gs.margin20,
    ...gs.shadow,
  },

  itemImage: {
    width: 300,
    height: 300,
    padding: 10,
    ...gs.radius10,
  },

  itemNameText: {
    alignSelf: 'stretch',
    textAlign: 'center',
    marginTop: 18,
  },

  itemPriceText: {
    fontSize: 35,
    paddingBottom: 50,
    fontWeight: 'bold',
    alignSelf: 'stretch',
    textAlign: 'center',
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
