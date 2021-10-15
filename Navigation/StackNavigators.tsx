import {createStackNavigator} from '@react-navigation/stack';
import AccountPage from '../MainPages/AccountPage';
import CartPage from '../MainPages/CartPage';
import EditWishlistPage from '../MainPages/Sub_Pages/EditWishlistPage';
import ItemPage from '../MainPages/Sub_Pages/ItemPage';
import PromotionsPage from '../MainPages/PromotionsPage';
import ReceiptPage from '../MainPages/Sub_Pages/ReceiptPage';
import ScanPage from '../MainPages/ScanPage';
import React from 'react';

const AccountStackNav = createStackNavigator();
export function AccountStack() {
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

const CartStackNav = createStackNavigator();
export function CartStack() {
  return (
    <CartStackNav.Navigator headerMode="none">
      <ScanStackNav.Screen name="MainCartPage" component={CartPage} />
      <ScanStackNav.Screen name="CartItemPage" component={ItemPage} />
    </CartStackNav.Navigator>
  );
}

const PromoStackNav = createStackNavigator();
export function PromoStack() {
  return (
    <PromoStackNav.Navigator headerMode="none">
      <ScanStackNav.Screen name="MainPromoPage" component={PromotionsPage} />
      <ScanStackNav.Screen name="PromoItemPage" component={ItemPage} />
    </PromoStackNav.Navigator>
  );
}

const ScanStackNav = createStackNavigator();
export function ScanStack() {
  return (
    <ScanStackNav.Navigator headerMode="none">
      <ScanStackNav.Screen name="MainScanPage" component={ScanPage} />
      <ScanStackNav.Screen name="ScanItemPage" component={ItemPage} />
    </ScanStackNav.Navigator>
  );
}
