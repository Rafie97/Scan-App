import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import React, {Component} from 'react';

import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Receipt from '../Models/CartModels/Receipt';
import Item from '../Models/ItemModels/Item';
import {Recipe} from '../Models/ItemModels/Recipe';
import gs from '../Styles/globalStyles';

//PROMO TILE
const PromoItemTile = ({isRecipe = false, ...item}: Item) => {
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
          style={[
            styles.promoPriceView,
            {backgroundColor: isRecipe ? '#4400fe' : '#0073FE'},
          ]}>
          <Text style={styles.promoPriceText}>${item.price.toFixed(2)}</Text>
        </View>

        <Text numberOfLines={2} style={styles.promoNameText}>
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

//FAMILY TILE
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
    <View style={styles.accountTabTile}>
      <Image
        source={require('../res/default_profile.jpg')}
        style={styles.accountTabImage}
      />

      <View style={{flex: 1, paddingTop: 10, alignSelf: 'stretch'}}>
        <Text style={[gs.bold, gs.taCenter]}>{props.name}</Text>
      </View>
    </View>
  );
};

//WISHLIST TILE
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
      style={styles.accountTabTile}>
      <Image
        source={require('../res/wishlist-tile.png')}
        style={styles.accountTabImage}
      />

      <View style={{flex: 1, paddingTop: 10, alignSelf: 'stretch'}}>
        <Text style={[gs.bold, gs.taCenter]}>{wishlist.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

//RECEIPT TILE
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
        });
      }}
      style={styles.receiptTile}>
      <Image
        source={require('../res/empty-receipt.png')}
        style={styles.accountTabImage}
      />
      <View style={styles.storeNameView}>
        <Text style={{textAlign: 'center', marginTop: 3, fontWeight: 'bold'}}>
          {props.receipt.storeId}
        </Text>
        <Text style={gs.taCenter}>{props.receipt.date}</Text>
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
  promoPriceView: {
    height: 30,
    width: 90,
    borderRadius: 20,
    marginLeft: 10,
    ...gs.jCenter,
  },

  promoPriceText: {
    marginVertical: 0,
    fontSize: 20,
    ...gs.bold,
    ...gs.taCenter,
    ...gs.white,
  },
  promoNameText: {
    fontSize: 18,
    marginLeft: 18,
    marginVertical: 5,
    textAlign: 'left',
    fontWeight: 'bold',
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
    ...gs.aSelfCenter,
  },
  accountTabTile: {
    height: 130,
    width: 100,
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  accountTabImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderColor: '#0073FE',
    borderWidth: 1,
    marginLeft: 10,
  },
  receiptTile: {
    height: 150,
    width: 100,
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  storeNameView: {
    ...gs.aSelfCenter,
    ...gs.flex1,
    ...gs.shadow,
    ...gs.width100,
  },
});
