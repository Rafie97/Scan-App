import React from 'react';
import {TouchableOpacity, View, Image, Text, StyleSheet} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Item from '../Models/ItemModels/Item';
import gs from '../Styles/globalStyles';

type PropTypes = {
  item: Item;
  navToItem: () => void;
  inCart?: boolean;
  quantity?: number;
  incrementQuantity?: (val: number) => void;
};

export default function ItemBubble(props: PropTypes) {
  const price: number = props.quantity
    ? props.item.price * props.quantity
    : props.item.price;

  return (
    <View style={[styles.itemBubble, {height: props.inCart ? 80 : 50}]}>
      <Image
        style={[
          styles.itemImage,
          {height: props.inCart ? 70 : 40, width: props.inCart ? 70 : 40},
        ]}
        source={{uri: props.item.imageLink}}
      />
      <TouchableOpacity
        style={[styles.textView, props.inCart ? gs.flexColumn : gs.flexRow]}
        onPress={props.navToItem}>
        <Text style={styles.itemLabel} numberOfLines={2}>
          {props.item.name}
        </Text>
        <Text style={props.inCart ? styles.itemPrice : styles.itemPriceThin}>
          ${price.toFixed(2)}
        </Text>
      </TouchableOpacity>
      {props.inCart && (
        <View style={styles.quantityModView}>
          <View style={{flexDirection: 'column', marginBottom: 5}}>
            <TouchableOpacity onPress={() => props.incrementQuantity(1)}>
              <EvilIcons name="plus" size={35} color="#0073FE" />
            </TouchableOpacity>
            <Text style={styles.quantityCountText}>x{props.quantity}</Text>
            <TouchableOpacity onPress={() => props.incrementQuantity(-1)}>
              <EvilIcons name="minus" size={35} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemBubble: {
    width: 360,
    marginBottom: 10,
    ...gs.bgWhite,
    ...gs.flexRow,
    ...gs.radius10,
    ...gs.shadow,
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
  itemImage: {
    marginLeft: 10,
    marginRight: 0,
    borderRadius: 10,
    ...gs.aSelfCenter,
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
