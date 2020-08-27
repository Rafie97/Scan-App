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


const WishlistStackNav = createStackNavigator();
function WishlistStack(){
  return(
    <WishlistStackNav.Navigator headerMode="none">
      <WishlistStackNav.Screen name="MainWishlistPage" component={WishlistPage}/>
      <WishlistStackNav.Screen name="EditWishlistPage" component={EditWishlistPage}/>
      <WishlistStackNav.Screen name="WishlistItemPage" component={ItemPage}/>
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

const CartStackNav = createStackNavigator();
function CartStack(){
  return (
    <PromoStackNav.Navigator headerMode='none'>
      <ScanStackNav.Screen name="MainCartPage" component={CartPage}/>
      <ScanStackNav.Screen name="CartItemPage" component={ItemPage}/>
    </PromoStackNav.Navigator>
  )
}

const TabNav = createBottomTabNavigator();


class AppNavigation extends Component{
  render(){
    return(
      <TabNav.Navigator tabBarOptions={{ tabStyle:{alignSelf:'center'}, keyboardHidesTabBar:true ,showLabel:false, style:{position:'absolute',alignItems:'center',bottom:0, left:0, backgroundColor:'transparent', paddingBottom:20, borderTopColor:'transparent', elevation:0}}}  initialRouteName="Promo" headerMode="none">
        <TabNav.Screen name="Wishlist" component={WishlistStack}     options={{tabBarIcon:()=><Entypo name="list" size={50} color="black"/>}} />
        <TabNav.Screen name="Map" component={MapPage}                options={{tabBarIcon:()=><Entypo name="location" size={40} color="black"/>}}/>
        <TabNav.Screen name="Promo" component={PromoStack}           options={{tabBarIcon:()=><Entypo name="price-tag" size={40} />}}/>
        <TabNav.Screen name="Scan" component={ScanStack}             options={{tabBarIcon:()=><FontAwe name="barcode" size={45} color="black"/>}}/>
        <TabNav.Screen name="Cart" component={CartStack}             options={{tabBarIcon:()=><FontAwe name="shopping-cart" size={40} color="black"/>}}/>
      </TabNav.Navigator>
    )
  }
}


export default AppNavigation;