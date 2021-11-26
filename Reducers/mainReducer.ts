import {NavigationProp} from '@react-navigation/native';
import {CartItem} from '../Models/ItemModels/CartItem';
import Item from '../Models/ItemModels/Item';
import {Recipe} from '../Models/ItemModels/Recipe';

export type StateType = {
  cart: CartItem[];
  items: Item[];
  recipes: Recipe[];
  total: number;
  user: string;
};

export const mainReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
      };
    case 'SET_RECIPES':
      return {
        ...state,
        recipes: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: addToCart([...state.cart], state.total, action.payload),
        total: addToTotal(state.total, action.payload),
      };
    default:
      return state;
  }
};

const addToCart = (currCart: CartItem[], currTotal: number, item: CartItem) => {
  let updated = false;
  currCart = currCart.map(cartItem => {
    //If there is a duplicate item in the cart just update its quantity
    if (cartItem.docID === item.docID) {
      updated = true;
      return {...cartItem, quantity: cartItem.quantity + 1};
    }
    return cartItem;
  });
  if (!updated) currCart.push(item);

  return currCart;
};

const addToTotal = (currTotal: number, item: CartItem) => {
  return currTotal + item.price;
};
