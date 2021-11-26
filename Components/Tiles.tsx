import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import React, {Component} from 'react';

import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Receipt} from '../Models/CartModels/Receipt';
import Item from '../Models/ItemModels/Item';
import {Recipe} from '../Models/ItemModels/Recipe';
import gs from '../Styles/globalStyles';

export interface PromoTileProps extends Recipe {
  isRecipe?: boolean;
}

//PROMO TILE

const PromoItemTile = ({isRecipe = false, ...item}: PromoTileProps) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        marginRight: 10,
        marginBottom: 10,
        width: isRecipe ? 200 : 160,
      }}>
      <TouchableOpacity
        style={styles.itemBox}
        onPress={() =>
          navigation.navigate('Promo', {
            screen: 'PromoItemPage',
            params: {itemIDCallback: item, isRecipe: isRecipe},
          })
        }>
        <Image style={styles.itemImage} source={{uri: item.imageLink}} />

        <View
          style={{
            height: 30,
            width: 90,
            borderRadius: 20,
            backgroundColor: isRecipe ? '#4400fe' : '#0073FE',
            justifyContent: 'center',
            marginLeft: 10,
          }}>
          <Text
            style={[
              styles.itemTitleText,
              {
                fontWeight: 'bold',
                marginVertical: 0,
                fontSize: 20,
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

type FamilyTileProps = {
  imageLink?: string;
  name: string;
};

const FamilyTile = (props: FamilyTileProps) => {
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
          params: {listNameCallback: wishlist.name},
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
    ...gs.bgWhite,
    ...gs.radius10,
    ...gs.shadow,
  },

  itemTitleText: {
    marginVertical: 5,
    fontSize: 18,
  },

  itemImage: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 5,
    borderRadius: 2,
    top: 0,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
