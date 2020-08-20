import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React, { Component } from 'react';
import ScanPage from '../MainPages/ScanPage';
import CartPage from '../MainPages/CartPage';
import MapPage from '../MainPages/MapPage';
import PromotionsPage from '../MainPages/PromotionsPage';
import WishlistPage from '../MainPages/WishlistPage';
import EditWishlistPage from '../MainPages/Sub_Pages/EditWishlistPage';
import ItemPage from '../MainPages/Sub_Pages/ItemPage';
import FontAwe from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MatCon from 'react-native-vector-icons/MaterialIcons';


const WishlistStackNav = createStackNavigator();
function WishlistStack(){
  return(
    <WishlistStackNav.Navigator headerMode="none">
      <WishlistStackNav.Screen name="MainWishlistPage" component={WishlistPage}/>
      <WishlistStackNav.Screen name="EditWishlistPage" component={EditWishlistPage}/>
      <WishlistStackNav.Screen name="WishItemPage" component={ItemPage}/>
    </WishlistStackNav.Navigator>
  )
}
  
  
const ScanStackNav = createStackNavigator();
function ScanStack(){
  return(
    <ScanStackNav.Navigator headerMode="none">
      <ScanStackNav.Screen name="MainScanPage" component={ScanPage}/>
      <ScanStackNav.Screen name="ScanItemPage" component={ItemPage}/>
    </ScanStackNav.Navigator>
  )
}

const PromoStackNav = createStackNavigator();
function PromoStack(){
  return (
    <PromoStackNav.Navigator headerMode='none'>
      <ScanStackNav.Screen name="MainPromoPage" component={PromotionsPage}/>
      <ScanStackNav.Screen name="PromoItemPage" component={ItemPage}/>
    </PromoStackNav.Navigator>
  )
}

const TabNav = createBottomTabNavigator();


class AppNavigation extends Component{
  render(){
    return(
      <TabNav.Navigator initialRouteName="Promotions" headerMode="none">
        <TabNav.Screen name="Wishlist" component={WishlistStack}     options={{tabBarIcon:()=><Entypo name="list" size={30} color="black"/>}} />
        <TabNav.Screen name="Map" component={MapPage}                options={{tabBarIcon:()=><Entypo name="location" size={30} color="black"/>}}/>
        <TabNav.Screen name="Promotions" component={PromoStack}      options={{tabBarIcon:()=><Entypo name="price-tag" size={30} />}}/>
        <TabNav.Screen name="Scan" component={ScanStack}             options={{tabBarIcon:()=><FontAwe name="barcode" size={30} color="black"/>}}/>
        <TabNav.Screen name="Cart" component={CartPage}              options={{tabBarIcon:()=><FontAwe name="shopping-cart" size={30} color="black"/>}}/>
      </TabNav.Navigator>
    )
  }
}


export default AppNavigation;