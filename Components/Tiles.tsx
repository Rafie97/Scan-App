import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import React, {Component} from 'react';

import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Receipt} from '../Models/Receipt';

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
          borderColor: '#dddddd',
          borderWidth: 2,
          marginLeft: 10,
        }}
      />

      <View style={{flex: 1, paddingTop: 10, alignSelf: 'center'}}>
        <Text style={{}}>{props.name}</Text>
      </View>
    </View>
  );
};

type ReceiptTileProps = {
  receipt: Receipt;
};
const ReceiptTile = (props: ReceiptTileProps) => {
  return (
    <View
      style={{
        height: 130,
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
          borderColor: '#dddddd',
          borderWidth: 2,
          marginLeft: 10,
        }}
      />

      <View style={{flex: 1, paddingTop: 10, alignSelf: 'center'}}>
        <Text
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 10,
          }}>
          {props.receipt.date}
        </Text>
      </View>
    </View>
  );
};

type WishlistTileProps = {
  name: string;
};
const WishlistTile = (props: WishlistTileProps) => {
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
        marginLeft: 20,
        alignItems: 'flex-end',
      }}>
      <Image
        source={require('../res/wishlist-tile.png')}
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
          borderColor: '#dddddd',
          borderWidth: 2,
          marginLeft: 10,
        }}
      />

      <View style={{flex: 1, paddingTop: 10, alignSelf: 'center'}}>
        <Text
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 10,
          }}>
          {props.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export type PromoTileProps = {
  imageLink: string;
  name: string;
  price: string;
  feeds?: number;
  isRecipe?: boolean;
};

const PromoItemTile = (item: PromoTileProps) => {
  const navigation = useNavigation();

  return (
    <View style={{marginHorizontal: 10, width: item.isRecipe ? 200 : 140}}>
      {/* <BlurView blurType="light" blurAmount={1}> */}
      <TouchableOpacity
        style={styles.itemBox}
        onPress={() =>
          navigation.navigate('Promo', {
            screen: 'PromoItemPage',
            params: {itemIDCallback: item},
          })
        }>
        <Image style={styles.itemImage} source={{uri: item.imageLink}} />

        <Text
          style={[
            styles.itemTitleText,
            {
              fontWeight: 'bold',
              marginVertical: 0,
              fontSize: 24,
              textAlign: 'center',
            },
          ]}>
          ${item.price}
        </Text>
        {item.feeds && (
          <Text style={{fontWeight: 'bold', marginLeft: 20}}>
            Feeds: {item.feeds}
          </Text>
        )}
        <Text
          numberOfLines={2}
          style={[
            styles.itemTitleText,
            {
              marginLeft: item.isRecipe ? 20 : 0,
              textAlign: item.isRecipe ? 'left' : 'center',
            },
          ]}>
          {item.name + `\n`}
        </Text>
        <View style={{height: 10}} />
      </TouchableOpacity>
      {/* </BlurView> */}
    </View>
  );
};

export {WishlistTile};
export {ReceiptTile};
export {PromoItemTile};
export default FamilyTile;

const styles = StyleSheet.create({
  itemView: {},

  itemBlurView: {},

  itemBox: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
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
