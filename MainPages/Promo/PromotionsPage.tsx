import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {PromoItemTile} from '../../Components/Tiles';
import {useNavigation} from '@react-navigation/native';
import gs from '../../Styles/globalStyles';
import {useStore} from '../../Reducers/store';
import LoginModal from '../../LoginPages/LoginModal';

function PromotionsPage() {
  const store = useStore();
  const navigation = useNavigation();
  return (
    <View style={gs.fullBackground}>
      {store.showLogin && <LoginModal visible={store.showLogin} />}
      <ScrollView
        style={[styles.promoPageContainer, gs.height100, gs.width100]}>
        <Text style={gs.header}>Today's Best Deals</Text>
        <Text style={[styles.exploreRecipesText]}>
          Explore our take-and-make recipes
        </Text>

        <View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
            showsHorizontalScrollIndicator={false}
            data={store.recipes}
            horizontal={true}
            renderItem={({item}) => {
              return (
                <PromoItemTile feeds={item.feeds} isRecipe={true} {...item} />
              );
            }}
          />
        </View>
        <View style={{height: 20}} />

        <View style={{flexDirection: 'row'}}>
          <Text style={styles.exploreCouponsText}>Explore our coupons</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Promo', {screen: 'AllItemsPage'})
            }
            style={styles.seeAllView}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
            showsHorizontalScrollIndicator={false}
            data={store.items.slice(0, 10)}
            horizontal={true}
            renderItem={({item}) => {
              return <PromoItemTile isRecipe={false} {...item} />;
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default PromotionsPage;

const styles = StyleSheet.create({
  exploreCouponsText: {
    fontSize: 18,
    ...gs.aStretch,
    ...gs.bold,
    ...gs.flex1,
    ...gs.blue,
    ...gs.margin20,
  },

  exploreRecipesText: {
    fontSize: 18,
    color: '#4400fe',
    ...gs.bold,
    ...gs.margin20,
  },

  promoPageContainer: {
    marginBottom: 60,
  },

  seeAllView: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#0073FE',
    width: 80,
    height: 35,
    margin: 10,
    ...gs.aSelfCenter,
    ...gs.jCenter,
  },
  seeAllText: {
    ...gs.aStretch,
    ...gs.blue,
    ...gs.jCenter,
    ...gs.taCenter,
  },
});
