import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component, useEffect} from 'react';
import ScanPage from '../MainPages/ScanPage';
import CartPage from '../MainPages/CartPage';
import MapPage from '../MainPages/Map/MapPage';
import PromotionsPage from '../MainPages/PromotionsPage';
import EditWishlistPage from '../MainPages/Sub_Pages/EditWishlistPage';
import ReceiptPage from '../MainPages/Sub_Pages/ReceiptPage';
import ItemPage from '../MainPages/Sub_Pages/ItemPage';
import FontAwe from 'react-native-vector-icons/FontAwesome';
import FontAwe5 from 'react-native-vector-icons/FontAwesome5';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ion from 'react-native-vector-icons/Ionicons';
import Ant from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import Item from '../Models/Item';

import {View} from 'react-native';
import AccountPage from '../MainPages/AccountPage';
import {mainReducer} from '../Reducers/mainReducer';

const AccountStackNav = createStackNavigator();
function AccountStack() {
  return (
    <AccountStackNav.Navigator initialRouteName="AccountPage" headerMode="none">
      <AccountStackNav.Screen name="AccountPage" component={AccountPage} />
      <AccountStackNav.Screen
        name="EditWishlistPage"
        component={EditWishlistPage}
      />
      <AccountStackNav.Screen name="AccountPageItemPage" component={ItemPage} />

      <AccountStackNav.Screen name="ReceiptPage" component={ReceiptPage} />
    </AccountStackNav.Navigator>
  );
}

const ScanStackNav = createStackNavigator();
function ScanStack() {
  return (
    <ScanStackNav.Navigator headerMode="none">
      <ScanStackNav.Screen name="MainScanPage" component={ScanPage} />
      <ScanStackNav.Screen name="ScanItemPage" component={ItemPage} />
    </ScanStackNav.Navigator>
  );
}

const PromoStackNav = createStackNavigator();
function PromoStack() {
  return (
    <PromoStackNav.Navigator headerMode="none">
      <ScanStackNav.Screen name="MainPromoPage" component={PromotionsPage} />
      <ScanStackNav.Screen name="PromoItemPage" component={ItemPage} />
    </PromoStackNav.Navigator>
  );
}

const CartStackNav = createStackNavigator();
function CartStack() {
  return (
    <PromoStackNav.Navigator headerMode="none">
      <ScanStackNav.Screen name="MainCartPage" component={CartPage} />
      <ScanStackNav.Screen name="CartItemPage" component={ItemPage} />
    </PromoStackNav.Navigator>
  );
}

const TabNav = createBottomTabNavigator();

export const StateContext = React.createContext();
export const DispatchContext = React.createContext();

export default function AppNavigation() {
  const [state, dispatch] = React.useReducer(mainReducer, {
    user: '',
    products: [],
    cart: [],
    total: 0,
  });

  useEffect(() => {
    const hebRef = firestore()
      .collection('stores')
      .doc('HEB')
      .collection('items');

    hebRef.onSnapshot(snap => {
      const newPromoItems = [];

      snap.forEach(async doc => {
        const item = new Item(doc);
        newPromoItems.push(item);
      });

      dispatch({type: 'SET_PRODUCTS', payload: newPromoItems});
      // console.log(state.products);
    });
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <TabNav.Navigator
          initialRouteName="Promo"
          tabBarOptions={{
            tabStyle: {alignSelf: 'center'},
            keyboardHidesTabBar: true,
            showLabel: false,
            activeBackgroundColor: '#b0abab',
            style: {
              position: 'absolute',
              alignItems: 'center',
              backgroundColor: 'white',
              borderTopWidth: 2,
              borderTopColor: 'black',
              height: 60,
            },
          }}
          headerMode="none">
          <TabNav.Screen
            name="Account"
            component={AccountStack}
            options={{
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    width: 55,
                    height: 55,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Material
                    name={focused ? 'account' : 'account-outline'}
                    size={50}
                    color="black"
                  />
                </View>
              ),
            }}
          />
          <TabNav.Screen
            name="Map"
            component={MapPage}
            options={{
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    width: 55,
                    height: 55,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Material
                    name={focused ? 'map-search' : 'map-search-outline'}
                    size={40}
                    color="black"
                  />
                </View>
              ),
            }}
          />
          <TabNav.Screen
            name="Promo"
            component={PromoStack}
            options={{
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    width: 55,
                    height: 55,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ant name={focused ? 'tags' : 'tagso'} size={45} />
                </View>
              ),
            }}
          />
          <TabNav.Screen
            name="Scan"
            component={ScanStack}
            style={{borderRadius: 100, borderWidth: 1}}
            options={{
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    width: 55,
                    height: 55,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 0,
                    paddingBottom: 4,
                  }}>
                  <FontAwe name="barcode" size={35} color="black" />
                  {focused ? (
                    <Ion
                      name="scan-outline"
                      size={60}
                      style={{
                        position: 'absolute',
                        right: 1,
                        bottom: -2,
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </View>
              ),
            }}
          />
          <TabNav.Screen
            name="Cart"
            component={CartStack}
            options={{
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    width: 55,
                    height: 55,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Material
                    name={focused ? 'cart' : 'cart-outline'}
                    size={40}
                    color="black"
                  />
                </View>
              ),
            }}
          />
        </TabNav.Navigator>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}
