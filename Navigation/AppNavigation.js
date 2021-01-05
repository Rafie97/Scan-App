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
import {firebase} from '@react-native-firebase/firestore';
import {View} from 'react-native';


const WishlistStackNav = createStackNavigator();
function WishlistStack(){
  return(
    <WishlistStackNav.Navigator initialRouteName="MainWishlistPage" headerMode="none">
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
      <TabNav.Navigator initialRouteName="Promo"  tabBarOptions={{ tabStyle:{alignSelf:'center'}, keyboardHidesTabBar:true ,showLabel:false, style:{position:'absolute',alignItems:'center',bottom:0, left:0, backgroundColor:'transparent',  borderTopColor:'transparent', elevation:0}}}   headerMode="none">
        
        <TabNav.Screen name="Wishlist" component={WishlistStack}     options={{tabBarIcon:()=><View style={{width:55, height:55, alignItems:'center', justifyContent:'center', paddingBottom:10}}><Entypo name="list" size={50} color="black"/></View>}} />
        <TabNav.Screen name="Map" component={MapPage}                options={{tabBarIcon:()=><View style={{width:55, height:55, alignItems:'center', justifyContent:'center', paddingBottom:10}}><Entypo name="location" size={40} color="black"/></View>}}/>
        <TabNav.Screen name="Promo" component={PromoStack}           options={{tabBarIcon:()=><View style={{width:55, height:55, alignItems:'center', justifyContent:'center', paddingBottom:10}}><Entypo name="price-tag" size={40} /></View>}}/>
        <TabNav.Screen name="Scan" component={ScanStack}             options={{tabBarIcon:()=><View style={{width:55, height:55, alignItems:'center', justifyContent:'center', paddingBottom:10}}><FontAwe name="barcode" size={45} color="black"/></View>}}/>
        <TabNav.Screen name="Cart" component={CartStack}             options={{tabBarIcon:()=><View style={{width:55, height:55, alignItems:'center', justifyContent:'center', paddingBottom:10}}><FontAwe name="shopping-cart" size={40} color="black"/></View>}}/>
    
      </TabNav.Navigator>
    )
  }
}


export default AppNavigation;