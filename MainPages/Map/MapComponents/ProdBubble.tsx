import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {useStore} from '../../../Reducers/store';
import gs from '../../../Styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import Item from '../../../Models/ItemModels/Item';

export default function ProdBubble({prods, coord}) {
  const navigation = useNavigation();
  const items = useStore().items;
  const [filtered, setFiltered] = useState<Item[]>([]);

  useEffect(() => {
    const filterd = prods.map(prod => {
      const match = items.findIndex(item => {
        return item.docID === prod;
      });
      if (match > -1) {
        return items[match];
      } else {
        return null;
      }
    });
    setFiltered(filterd);
  }, [prods, items]);

  return (
    <View style={[styles.prodBubbleContainer, {left: coord.x, top: coord.y}]}>
      {filtered.map(prod => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Promo', {
                screen: 'PromoItemPage',
                initial: false,
                params: {itemIDCallback: prod, isRecipe: true},
              });
            }}
            style={{
              borderBottomWidth: 1,
            }}>
            <Text style={{color: 'white', textAlign: 'center', margin: 10}}>
              {prod.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = {
  prodBubbleContainer: {
    maxWidth: 120,
    ...gs.flexColumn,
    ...gs.bgBlue,
    ...gs.radius10,
    ...gs.shadow,
  },
};
