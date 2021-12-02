import React, {useContext} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {NavContext} from '../../../Navigation/AppNavigation';
import {useStore} from '../../../Reducers/store';
import gs from '../../../Styles/globalStyles';

export default function ProdBubble({prods, coord}) {
  const navigation = useContext(NavContext);
  const items = useStore().items;

  return (
    <View style={[styles.prodBubbleContainer, {left: coord.x, top: coord.y}]}>
      {prods.map(prod => {
        const match = items.findIndex(item => {
          return item.docID === prod;
        });
        return (
          match > -1 && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Promo', {
                  screen: 'PromoItemPage',
                  initial: false,
                  params: {itemIDCallback: items[match], isRecipe: true},
                });
              }}
              style={{
                paddingVertical: 7,
                paddingLeft: 6,
                borderBottomWidth: 1,
              }}>
              <Text style={{color: 'white'}}>{items[match].name}</Text>
            </TouchableOpacity>
          )
        );
      })}
    </View>
  );
}

const styles = {
  prodBubbleContainer: {
    maxWidth: 100,
    ...gs.flexColumn,
    ...gs.bgBlue,
    ...gs.radius10,
    ...gs.shadow,
  },
};
