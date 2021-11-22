import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import React, {Component} from 'react';

import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Receipt} from '../Models/CartModels/Receipt';
import gs from '../Styles/globalStyles';

export type PromoTileProps = {
  imageLink: string;
  name: string;
  price: string;
  priceHistory: number[];
  feeds?: number;
  isRecipe?: boolean;
};

//PROMO TILE

const PromoItemTile = (item: PromoTileProps) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        marginRight: 20,
        width: item.isRecipe ? 200 : 180,
      }}>
      <TouchableOpacity
        style={styles.itemBox}
        onPress={() =>
          navigation.navigate('Promo', {
            screen: 'PromoItemPage',
            params: {itemIDCallback: item, isRecipe: item.isRecipe},
          })
        }>
        <Image style={styles.itemImage} source={{uri: item.imageLink}} />

        <View
          style={{
            height: 35,
            width: 90,
            borderRadius: 20,
            backgroundColor: item.isRecipe ? '#4400fe':'#0073FE',
            justifyContent: 'center',
            marginLeft: 10,
          }}>
          <Text
            style={[
              styles.itemTitleText,
              {
                fontWeight: 'bold',
                marginVertical: 0,
                fontSize: 16,
                textAlign: 'center',
                color: 'white',
              },
            ]}>
            ${item.price}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          style={[
            styles.itemTitleText,
            {
              marginLeft: 18,
              textAlign: 'left',
              fontWeight: 'bold',
            },
          ]}>
          {item.name + `\n`}
        </Text>
        {item.feeds && (
          <Text style={{marginLeft: 20}}>Feeds: {item.feeds}</Text>
        )}
        <View style={{height: 10}} />
      </TouchableOpacity>
    </View>
  );
};

type TileProps = {
  imageLink?: string;
  name: string;
};

const FamilyTile = (props: TileProps) => {
  const [sauce, setSauce] = React.useState();

  React.useEffect(() => {
    if (props.imageLink || props.imageLink === '') {
      // setSauce(require('../../res/' + props.imageLink));
    } else {
      // setSauce(require('../../res/default_profile.jpg'));
    }
  });

  return (
    <View
      style={{
        height: 130,
        width: 100,
        marginLeft: 10,
        alignItems: 'flex-end',
      }}>
      <Image
        source={require('../res/default_profile.jpg')}
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
          borderColor: '#0073FE',
          borderWidth: 1,
          marginLeft: 10,
        }}
      />

      <View style={{flex: 1, paddingTop: 10, alignSelf: 'stretch'}}>
        <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
          {props.name}
        </Text>
      </View>
    </View>
  );
};

type WishlistTileProps = {
  name: string;
};
const WishlistTile = (wishlist: WishlistTileProps) => {
  const nav = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        nav.navigate('Account', {
          screen: 'EditWishlistPage',
          params: {listNameCallback: props.name},
        });
      }}
      style={{
        height: 130,
        width: 100,
        marginLeft: 10,
        alignItems: 'flex-end',
      }}>
      <Image
        source={require('../res/wishlist-tile.png')}
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
          borderColor: '#0073FE',
          borderWidth: 1,
          marginLeft: 10,
        }}
      />

      <View style={{flex: 1, paddingTop: 10, alignSelf: 'stretch'}}>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {wishlist.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

type ReceiptTileProps = {
  receipt: Receipt;
};
const ReceiptTile = (props: ReceiptTileProps) => {
  const nav = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        nav.navigate('Account', {
          screen: 'ReceiptPage',
          // params: {listNameCallback: props.name},
        });
      }}
      style={{
        height: 150,
        width: 100,
        marginLeft: 10,
        alignItems: 'flex-end',
      }}>
      <Image
        source={require('../res/empty-receipt.png')}
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
          borderColor: '#0073fe',
          borderWidth: 1,
          marginLeft: 10,
        }}
      />

      <View
        style={{
          flex: 1,
          width: '100%',
          alignSelf: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 4,
        }}>
        <Text style={{textAlign: 'center', marginTop: 3, fontWeight: 'bold'}}>
          {props.receipt.storeId}
        </Text>
        <Text style={{textAlign: 'center'}}>{props.receipt.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export {WishlistTile};
export {ReceiptTile};
export {PromoItemTile};
export default FamilyTile;

const styles = StyleSheet.create({
  itemBox: {
    borderColor: 'black',
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 1,
    shadowRadius: 9.11,
  },

  itemTitleText: {
    marginVertical: 5,
    fontSize: 20,
  },

  itemImage: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 5,
    borderRadius: 2,
    top: 0,
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
