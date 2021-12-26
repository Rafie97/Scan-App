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
    <View style={styles.itemBubble}>
      <Image source={{uri: props.item.imageLink}} style={styles.itemImage} />
      <TouchableOpacity style={styles.textView} onPress={props.navToItem}>
        <Text style={styles.itemLabel} numberOfLines={2}>
          {props.item.name}
        </Text>
        <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>
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
  textView: {
    marginVertical: 10,
    width: '40%',
    height: '75%',
    justifyContent: 'center',
  },
  quantityModView: {
    alignSelf: 'center',
    position: 'absolute',
    right: 0,
    marginRight: 20,
  },
  quantityCountText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    width: 20,
  },

  itemBubble: {
    width: 362,
    height: 80,
    marginBottom: 10,
    marginRight: 10,
    ...gs.bgWhite,
    ...gs.flexRow,
    ...gs.radius10,
    ...gs.shadow,
  },

  itemImage: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    marginLeft: 10,
    marginRight: 0,
    borderRadius: 10,
    borderColor: 'grey',
  },

  itemLabel: {
    marginLeft: 20,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
    width: '120%',
  },

  itemPrice: {
    marginLeft: 20,
    fontSize: 16,
  },
});
