import React, {Component, useState} from 'react';
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
import FamilyTile from '../Models/Components/FamilyTile';
import {BlurView} from 'react-native-blur';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';

function PromotionsPage() {
  const [loading, setLoading] = useState(true);
  const [promoItems, setPromoItems] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const hebRef = firestore()
      .collection('stores')
      .doc('HEB')
      .collection('items');

    hebRef.onSnapshot(snap => {
      setPromoItems([]);
      const newPromoItems = [];
      snap.forEach(async doc => {
        const item = new Item(doc);
        newPromoItems.push(item);
      });
      setPromoItems(newPromoItems);
    });
  }, []);

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
          imageLink: doc.data().imageLink,
          name: doc.data().name,
        };
        newRecipes.push(item);
      });
      setRecipes(newRecipes);
    });
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.itemBox}
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate('Promo', {
            screen: 'PromoItemPage',
            params: {itemIDCallback: item},
          })
        }>
        <Image style={styles.itemImage} source={{uri: item.imageLink}} />

        <Text style={[styles.itemTitleText, {fontWeight: 'bold'}]}>
          ${item.price}
        </Text>

        <Text style={styles.itemTitleText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // let arr = [];
  // state.promoItems.forEach(i => {
  //   arr = [...arr, i.name];
  // });

  return (
    <ImageBackground
      source={require('../res/grad_3.png')}
      style={styles.fullBackground}>
      <ScrollView style={styles.promoPageContainer}>
        <Text style={styles.promoTitle}>Today's Best Deals</Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: 20,
            marginBottom: 10,
          }}>
          Explore our coupons
        </Text>
        <View style={{height: 240}}>
          <FlatList
            data={promoItems}
            horizontal={true}
            renderItem={renderItem}
          />
        </View>
        <View style={{height: 20}} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: 20,
            marginBottom: 10,
          }}>
          Explore our take-and-make recipes
        </Text>
        <View style={{height: 160}}>
          <FlatList
            data={recipes}
            horizontal={true}
            renderItem={({item}) => {
              const link = item.imageLink;

              return (
                <View
                  style={{
                    height: 130,
                    width: 100,
                    marginLeft: 10,
                    alignItems: 'flex-end',
                  }}>
                  <Image
                    source={{uri: link}}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      borderColor: '#dddddd',
                      borderWidth: 2,
                      marginLeft: 10,
                    }}
                  />

                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                      }}>
                      {item.name}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export default PromotionsPage;

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
  },

  promoPageContainer: {
    width: '100%',
    height: '100%',
    marginBottom: 60,
  },
  gridContainer: {
    width: 400,
    marginBottom: 60,
  },

  promoTitle: {
    marginTop: 40,
    marginBottom: 60,
    textAlign: 'center',
    fontSize: 24,
  },

  promoFooter: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#c8e8e4',
    justifyContent: 'space-around',
  },

  itemBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 20,
    marginHorizontal: 10,
    width: 200,
    maxHeight: 240,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },

  itemTitleText: {
    textAlign: 'left',
    marginVertical: 5,
    marginLeft: 20,
    fontSize: 20,
  },

  itemImage: {
    marginTop: 5,
    marginBottom: 20,
    marginHorizontal: 5,
    borderRadius: 2,
    top: 0,
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});