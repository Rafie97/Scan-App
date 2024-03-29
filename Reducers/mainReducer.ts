import {NavigationProp} from '@react-navigation/native';
import Item from '../Models/ItemModels/Item';
import {Recipe} from '../Models/ItemModels/Recipe';
import Map from '../Models/MapModels/Map';
import User from '../Models/UserModels/User';

export type StateType = {
  user: User;
  map: Map;
  items: Item[];
  recipes: Item[];
  total: number;
  showLogin: boolean;
};

export const mainReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_WISHLISTS':
      return {
        ...state,
        user: {
          ...state.user,
          wishlists: action.payload,
        },
      };

    case 'SET_RECEIPTS':
      return {
        ...state,
        user: {
          ...state.user,
          receipts: action.payload,
        },
      };
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
    case 'SET_MAP':
      return {
        ...state,
        map: action.payload,
      };
    case 'SET_CART':
      return {
        ...state,
        user: {
          ...state.user,
          cart: action.payload,
        },
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        user: {
          ...state.user,
          cart: addToCart([...state.cart], state.total, action.payload),
        },
        total: addToTotal(state.total, action.payload),
      };
    case 'SET_LOGIN_MODAL':
      return {
        ...state,
        showLogin: action.payload,
      };

    default:
      return state;
  }
};

const addToCart = (currCart: Item[], currTotal: number, item: Item) => {
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

const addToTotal = (currTotal: number, item: Item) => {
  return currTotal + item.price;
};
