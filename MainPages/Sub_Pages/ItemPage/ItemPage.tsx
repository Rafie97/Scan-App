import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Item from '../../../Models/ItemModels/Item';
import gs from '../../../Styles/globalStyles';
import PriceChart from './ItemComponents/PriceChart';
import ReviewCard from './ItemComponents/ReviewCard';
import WishlistModal from './ItemComponents/WishlistModal';

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
  const thing = route.params.itemIDCallback;
  const [wishlistModal, setWishlistModal] = useState(false);
  const [wishlists, setWishlists] = useState<string[]>([]);
  const [lineChartData, setLineChartData] = useState<LineChartDataType>({
    labels: [],
    datasets: [{data: []}],
  });

  const navigate = useNavigation();

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
            <View style={styles.imageContainer}>
              <Image style={styles.itemImage} source={{uri: thing.imageLink}} />
            </View>
            <Text style={[styles.itemNameText]}>{thing.name}</Text>

            <Text style={styles.itemPriceText}>${thing.price}</Text>
            {!route.params.isRecipe && lineChartData.labels.length ? (
              <PriceChart lineChartData={lineChartData} />
            ) : null}

            <ReviewCard
              reviews={[
                {
                  reviewer: 'Rafa',
                  reviewText: 'I love this product! I use it daily',
                  date: '11/25/2021',
                  rating: 5,
                },
                {
                  reviewer: 'Neto',
                  reviewText: 'Please stop screaming',
                  date: '10/18/2021',
                  rating: 3,
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
      <WishlistModal
        itemID={thing.docID}
        visible={wishlistModal}
        setVisible={setWishlistModal}
        wishlists={wishlists}
      />
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
    marginTop: 10,
    width: 200,
    height: 60,
    backgroundColor: '#0073FE',
    justifyContent: 'center',
    borderRadius: 10,
    ...gs.shadow,
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
    fontSize: 24,
    fontWeight: 'bold',
  },

  itemPriceText: {
    fontSize: 35,
    fontWeight: 'bold',
    alignSelf: 'stretch',
    textAlign: 'center',
    ...gs.margin20,
  },
});
