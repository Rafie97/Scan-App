import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, FlatList} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useStore} from '../../Reducers/store';
import {PromoItemTile} from '../../Components/Tiles';
import gs from '../../Styles/globalStyles';

export default function AllItemsPage() {
  const navigation = useNavigation();
  const store = useStore();

  return (
    <View style={gs.fullBackground}>
      <View style={styles.promoItemsFlatList}>
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          data={store.items}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          renderItem={({item}) => {
            return <PromoItemTile isRecipe={false} {...item} />;
          }}
          contentContainerStyle={{
            paddingLeft: 45,
            paddingTop: 20,
            paddingBottom: 60,
          }}
        />
      </View>
      <View style={styles.backButtonView}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() =>
            navigation.navigate('Promo', {screen: 'MainPromoPage'})
          }>
          <Ionicon name="arrow-back-circle-outline" size={45} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  backButtonView: {
    position: 'absolute' as 'absolute',
    top: 10,
    left: 5,
    ...gs.aCenter,
  },
  promoItemsFlatList: {
    ...gs.aCenter,
    ...gs.flex1,
    ...gs.jCenter,
  },
};
