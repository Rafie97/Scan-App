import React from 'react';
import {TouchableOpacity, View, Image, Text, StyleSheet} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Item from '../Models/ItemModels/Item';
import gs from '../Styles/globalStyles';

type PropTypes = {
  item?: Item;
  navToItem: () => void;
  inCart?: boolean;
  quantity?: number;
  incrementQuantity?: (val: number) => void;
};

export default function ItemBubble({
  item,
  navToItem,
  inCart,
  quantity,
  incrementQuantity,
}: PropTypes) {
  const price = () => {
    if (item) {
      return quantity ? item.price * quantity : item.price;
    }
    return undefined;
  };

  return (
    <View
      style={[
        styles.itemBubble,
        {
          height: !item || inCart ? 80 : 50,
        },
      ]}>
      {item && (
        <>
          <Image
            style={[
              styles.itemImage,
              {
                height: inCart ? 70 : 40,
                width: inCart ? 70 : 40,
              },
            ]}
            source={{uri: item.imageLink}}
          />
          <TouchableOpacity
            style={[styles.textView, inCart ? gs.flexColumn : gs.flexRow]}
            onPress={navToItem}>
            <Text style={styles.itemLabel} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={inCart ? styles.itemPrice : styles.itemPriceThin}>
              ${price().toFixed(2)}
            </Text>
          </TouchableOpacity>
          {inCart && (
            <View style={styles.quantityModView}>
              <View style={{...gs.flexColumn, marginBottom: 5}}>
                <TouchableOpacity onPress={() => incrementQuantity(1)}>
                  <EvilIcons name="plus" size={35} color="#0073FE" />
                </TouchableOpacity>
                <Text style={styles.quantityCountText}>x{quantity}</Text>
                <TouchableOpacity onPress={() => incrementQuantity(-1)}>
                  <EvilIcons name="minus" size={35} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemBubble: {
    width: 335,
    marginBottom: 10,
    marginRight: 10,
    ...gs.bgWhite,
    ...gs.flexRow,
    ...gs.radius10,
    ...gs.shadow,
  },

  itemImage: {
    marginLeft: 10,
    marginRight: 0,
    borderRadius: 10,
    ...gs.aSelfCenter,
  },

  textView: {
    marginVertical: 10,
    width: '60%',
    flex: 1,
    marginLeft: 20,
    height: '75%',
    justifyContent: 'center',
  },

  quantityModView: {
    alignSelf: 'center',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 5,
  },

  quantityCountText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    width: 20,
  },

  itemLabel: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },

  itemPrice: {
    fontSize: 16,
    flex: 1,
  },

  itemPriceThin: {
    fontSize: 16,
    marginTop: 4,
    marginRight: 20,
    textAlign: 'right',
    flex: 1,
  },
});
