import React, {useState, useEffect} from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
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
import {Recipe} from '../../../Models/ItemModels/Recipe';

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
      itemIDCallback: Item | Recipe;
      isRecipe: boolean;
    };
  };
};

function ItemPage({route}: ItemPageParams) {
  const item = route.params.itemIDCallback;
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
    const newItem = new Item(item);
    //@ts-ignore
    newItem.quantity = 1;
    cartRef.add(newItem);
    navigate.navigate('Cart');
  }

  useEffect(() => {
    let vals = [];
    let labels = [];

    if (!route.params.isRecipe && item && item.priceHistory) {
      let i = 0;
      item.priceHistory.forEach((value, key) => {
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
  }, [route.params.isRecipe, item]);

  return (
    <View style={gs.fullBackground}>
      <View style={styles.backButtonView}>
        <TouchableOpacity
          style={[{flexDirection: 'row'}]}
          onPress={() => navigate.goBack()}>
          <Ionicon name="arrow-back-circle-outline" size={45} />
        </TouchableOpacity>
      </View>

      {!!item && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.innerScroll}>
            <View style={styles.imageContainer}>
              <Image style={styles.itemImage} source={{uri: item.imageLink}} />
            </View>
            <Text style={[styles.itemNameText]}>{item.name}</Text>

            <Text style={styles.itemPriceText}>${item.price.toFixed(2)}</Text>
            {!route.params.isRecipe && lineChartData.labels.length ? (
              <PriceChart lineChartData={lineChartData} />
            ) : null}

            <ReviewCard
              itemId={item.docID}
              reviews={[
                {
                  id: '1',
                  reviewerId: '1',
                  reviewerName: 'Rafa',
                  reviewText: 'I love this product! I use it daily',
                  createdAt: new Date(Date.now()),
                  rating: 5,
                  productId: item.docID,
                },
                {
                  id: '2',
                  reviewerId: '2',
                  reviewerName: 'Neto',
                  reviewText: 'Please stop screaming',
                  createdAt: new Date(Date.now()),
                  rating: 3,
                  productId: item.docID,
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
        itemID={item.docID}
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
    fontSize: 18,
    ...gs.aSelfCenter,
    ...gs.white,
  },

  innerScroll: {
    ...gs.aCenter,
    ...gs.flex1,
    ...gs.jCenter,
  },
  bottomButtons: {
    marginBottom: 20,
    marginTop: 10,
    width: 200,
    height: 60,
    borderRadius: 10,
    ...gs.bgBlue,
    ...gs.jCenter,
    ...gs.shadow,
  },
  backButton: {
    ...gs.flex1,
  },
  backButtonView: {
    top: 10,
    left: 5,
    ...gs.aCenter,
    ...gs.jCenter,
    ...gs.pAbsolute,
  },

  imageContainer: {
    ...gs.radius10,
    ...gs.margin20,
    ...gs.shadow,
  },

  itemImage: {
    width: 280,
    height: 280,
    padding: 10,
    ...gs.radius10,
  },

  itemNameText: {
    fontSize: 24,
    ...gs.aStretch,
    ...gs.bold,
    ...gs.taCenter,
  },

  itemPriceText: {
    fontSize: 35,
    ...gs.aStretch,
    ...gs.bold,
    ...gs.margin20,
    ...gs.taCenter,
  },
});
