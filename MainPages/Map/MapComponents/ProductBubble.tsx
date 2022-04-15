import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {useStore} from '../../../Reducers/store';
import gs from '../../../Styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import Item from '../../../Models/ItemModels/Item';
import Coordinate from '../../../Models/MapModels/Coordinate';

export default function ProductBubble({prods, coord, mapSize, scaleFactor}) {
  const navigation = useNavigation();
  const items = useStore().items;
  const [filtered, setFiltered] = useState<Item[]>([]);
  const [newCoord, setNewCoord] = useState<Coordinate>(coord);
  const height = filtered.length ? filtered.length * 40 : 0;

  useEffect(() => {
    const filterd = prods.map(prod => {
      const match = items.findIndex(item => {
        return item.docID === prod;
      });
      if (match <= -1) return null;
      return items[match];
    });
    setFiltered(filterd);
  }, [prods, items]);

  useEffect(() => {
    if (coord.x > mapSize.width * scaleFactor - 120) {
      setNewCoord({x: coord.x - 120, y: coord.y});
    }
    if (coord.y > mapSize.height * scaleFactor - 200) {
      setNewCoord({x: coord.x, y: coord.y - height});
    }
  }, [filtered, coord]);

  return (
    <View
      style={[styles.prodBubbleContainer, {left: newCoord.x, top: newCoord.y}]}>
      {filtered.map((prod, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Promo', {
                screen: 'PromoItemPage',
                initial: false,
                params: {itemIDCallback: prod, isRecipe: false},
              });
            }}
            style={
              index < filtered.length - 1 && {
                borderBottomWidth: 1,
              }
            }>
            <Text style={styles.prodNameText}>{prod.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = {
  prodBubbleContainer: {
    maxWidth: 120,
    maxHeight: 200,
    marginLeft: 5,
    marginTop: -5,
    position: 'absolute' as 'absolute',
    ...gs.flexColumn,
    ...gs.bgBlue,
    ...gs.radius10,
    ...gs.shadow,
  },

  prodNameText: {
    margin: 10,
    fontSize: 14,
    ...gs.taCenter,
    ...gs.white,
  },
};
