import {CartItem} from '../Models/CartItem';
import Item from '../Models/Item';

export type stateType = {
  user: string;
  products: Item[];
  cart: Item[];
  total: number;
};

export const mainReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
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
  currCart = currCart.map(cItem => {
    //If there is a duplicate item in the cart just update its quantity
    if (cItem.baseItem.docID === item.baseItem.docID) {
      updated = true;
      return {...cItem, quantity: cItem.quantity + 1};
    }
    return cItem;
  });
  if (!updated) currCart.push(item);

  return currCart;
};

const addToTotal = (currTotal: number, item: CartItem) => {
  return currTotal + item.baseItem.price;
};
