import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import MapPage from '../MainPages/Map/MapPage';
import FontAwe from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ion from 'react-native-vector-icons/Ionicons';
import Ant from 'react-native-vector-icons/AntDesign';
import {View} from 'react-native';
import {mainReducer, StateType} from '../Reducers/mainReducer';
import {loadItems} from '../Reducers/actions/appPersist';
import {
  AccountStack,
  CartStack,
  PromoStack,
  ScanStack,
} from './StackNavigators';
import {NavigationProp, useNavigation} from '@react-navigation/core';

const initialState: StateType = {
  cart: [],
  products: [],
  total: 0,
  user: '',
};

function setupListeners(dispatch) {
  dispatch(loadItems);
  console.log();
}

const TabNav = createBottomTabNavigator();

export const StateContext = React.createContext<StateType>(initialState);
export const DispatchContext = React.createContext(val => {});
export const NavContext = React.createContext<NavigationProp<any>>(null);

export default function AppNavigation() {
  const [state, dispatch] = React.useReducer(mainReducer, initialState);
  const navigation = useNavigation();

  useEffect(() => {
    setupListeners(dispatch);
    console.log('state', state);
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <NavContext.Provider value={navigation}>
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
                  <View style={styles.iconView}>
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
                  <View style={styles.iconView}>
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
                  <View style={styles.iconView}>
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
                  <View style={[styles.iconView, styles.scanPadding]}>
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
                  <View style={styles.iconView}>
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
        </NavContext.Provider>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

const styles = StyleSheet.create({
  iconView: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanPadding: {
    paddingTop: 0,
    paddingBottom: 4,
  },
});