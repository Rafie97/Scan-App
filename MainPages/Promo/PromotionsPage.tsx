import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {PromoItemTile} from '../../Components/Tiles';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {Recipe} from '../../Models/ItemModels/Recipe';
import gs from '../../Styles/globalStyles';
import {useStore} from '../../Reducers/store';

function PromotionsPage() {
  const [recipes, setRecipes] = useState([]);
  const store = useStore();
  const navigation = useNavigation();

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
    <View style={gs.fullBackground}>
      <ScrollView
        style={[styles.promoPageContainer, gs.height100, gs.width100]}>
        <Text style={gs.header}>Today's Best Deals</Text>
        <Text style={[styles.exploreRecipesText, gs.margin20]}>
          Explore our take-and-make recipes
        </Text>

        <View>
          <FlatList
            contentContainerStyle={{
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
            showsHorizontalScrollIndicator={false}
            data={recipes}
            horizontal={true}
            renderItem={({item}) => {
              return (
                <PromoItemTile feeds={item.feeds} isRecipe={true} {...item} />
              );
            }}
          />
        </View>
        <View style={{height: 20}} />

        <View style={{flexDirection: 'row'}}>
          <Text style={styles.exploreCouponsText}>Explore our coupons</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Promo', {screen: 'AllItemsPage'})
            }
            style={styles.seeAllView}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            contentContainerStyle={{
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
            showsHorizontalScrollIndicator={false}
            data={store.products.slice(0, 10)}
            horizontal={true}
            renderItem={({item}) => {
              return <PromoItemTile isRecipe={false} {...item} />;
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
    ...gs.blue,
  },

  exploreRecipesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4400fe',
  },

  promoPageContainer: {
    marginBottom: 60,
  },

  seeAllView: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#0073FE',
    width: 80,
    marginRight: 10,
    ...gs.jCenter,
  },
  seeAllText: {
    alignSelf: 'stretch',
    ...gs.blue,
    ...gs.jCenter,
    ...gs.taCenter,
  },
});
