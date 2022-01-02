import Receipt from '../CartModels/Receipt';
import {CartItem} from '../ItemModels/CartItem';

export default interface User {
  id: string;
  name: string;
  family?: string[];
  wishlists?: Wishlist[];
  receipts?: Receipt[];
  cart?: CartItem[];
}

export interface Wishlist {
  id: string;
  items: string[];
}
