import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, FlatList} from 'react-native';
import Item from '../../Models/ItemModels/Item';
import gs from '../../Styles/globalStyles';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {StateContext} from '../../Navigation/AppNavigation';

export default function AllItemsPage() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();
  const overallState = useContext(StateContext);

  useEffect(() => {
    console.log(overallState);
  });

  return (
    <View style={gs.fullBackground}>
      <View style={[]}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() =>
            navigation.navigate('Promo', {screen: 'MainPromoPage'})
          }>
          <Ionicon
            name="arrow-back-circle-outline"
            size={50}
            style={{marginLeft: 10, marginTop: 5}}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
        <View style={[]}>
          {/* <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={items}
            renderItem={renderItem}
          /> */}
        </View>
      </View>
    </View>
  );
}
