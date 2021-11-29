import React, {useContext} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {NavContext} from '../../../Navigation/AppNavigation';
import {useStore} from '../../../Reducers/store';
import gs from '../../../Styles/globalStyles';

export default function ProdBubble({prods, coord}) {
  const navigation = useContext(NavContext);
  const store = useStore();
  const items = store.items;

  return (
    <View
      style={[
        gs.flexColumn,
        gs.bgBlue,
        gs.radius10,
        {
          left: coord.x,
          top: coord.y,
          maxWidth: 100,
        },
      ]}>
      {prods.map(prod => {
        const match = items.findIndex(item => {
          return item.docID === prod;
        });

        return (
          match > -1 && (
            <TouchableOpacity
              // activeOpacity={0.6}
              // underlayColor="black"
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
              }}>
              <Text style={{color: 'white'}}>{items[match].name}</Text>
            </TouchableOpacity>
          )
        );
      })}
    </View>
  );
}
