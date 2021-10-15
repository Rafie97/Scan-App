import React, {Component, useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import Grid from 'react-native-grid-component';
import firestore from '@react-native-firebase/firestore';
import Item from '../Models/Item';
import FamilyTile, {PromoItemTile, PromoTileProps} from '../Components/Tiles';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {Recipe} from '../Models/Recipe';
import {mainReducer} from '../Reducers/mainReducer';
import {StateContext} from '../Navigation/AppNavigation';
import globalStyles from '../Styles/globalStyles';

function PromotionsPage() {
  const [loading, setLoading] = useState(true);
  const [promoItems, setPromoItems] = useState<PromoTileProps[]>([]);
  const [recipes, setRecipes] = useState([]);

  const overallState = useContext(StateContext);

  const navigation = useNavigation();

  useEffect(() => {
    setPromoItems(overallState.products);
  }, [overallState.products]);

  useEffect(() => {
    const hebRef = firestore()
      .collection('stores')
      .doc('HEB')
      .collection('recipes');

    hebRef.onSnapshot(snap => {
      setRecipes([]);
      const newRecipes = [];
      snap.forEach(async doc => {
        const item = {
          ...doc.data(),
        } as Recipe;
        newRecipes.push(item);
      });
      setRecipes(newRecipes);
    });
  }, []);

  return (
    <View style={globalStyles.fullBackground}>
      <ScrollView style={styles.promoPageContainer}>
        <Text style={globalStyles.header}>Today's Best Deals</Text>
        <Text style={styles.exploreRecipesText}>
          Explore our take-and-make recipes
        </Text>

        <View>
          <FlatList
            contentContainerStyle={{
              paddingVertical: 10,
            }}
            showsHorizontalScrollIndicator={false}
            data={recipes}
            horizontal={true}
            renderItem={({item}) => {
              return (
                <PromoItemTile
                  imageLink={item.imageLink}
                  name={item.name}
                  price={item.price}
                  priceHistory={item.priceHistory}
                  feeds={item.feeds}
                  isRecipe={true}
                />
              );
            }}
          />
        </View>
        <View style={{height: 20}} />

        <View style={{flexDirection: 'row'}}>
          <Text style={styles.exploreCouponsText}>Explore our coupons</Text>
          <View style={styles.seeAllView}>
            <Text style={styles.seeAllText}>See All</Text>
          </View>
        </View>
        <View>
          <FlatList
            contentContainerStyle={{
              paddingVertical: 10,
            }}
            showsHorizontalScrollIndicator={false}
            data={promoItems.slice(0, 10)}
            horizontal={true}
            renderItem={({item}) => {
              return (
                <PromoItemTile
                  imageLink={item.imageLink}
                  name={item.name}
                  price={item.price}
                  priceHistory={item.priceHistory}
                  isRecipe={false}
                />
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default PromotionsPage;

const styles = StyleSheet.create({
  exploreCouponsText: {
    alignSelf: 'stretch',
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
    color: '#0073FE',
  },

  exploreRecipesText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
    color: '#0073FE',
  },

  promoPageContainer: {
    width: '100%',
    height: '100%',
    marginBottom: 60,
  },

  promoFooter: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#c8e8e4',
    justifyContent: 'space-around',
  },
  seeAllView: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#0073FE',
    width: 80,
    justifyContent: 'center',
    marginRight: 10,
  },
  seeAllText: {
    color: '#0073FE',
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});
