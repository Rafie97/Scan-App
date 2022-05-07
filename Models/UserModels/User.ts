import Receipt from '../CartModels/Receipt';
import Item from '../ItemModels/Item';

export default interface User {
  id: string;
  name: string;
  family?: string[];
  wishlists?: Wishlist[];
  receipts?: Receipt[];
  cart?: Item[];
}

export interface Wishlist {
  id: string;
  items: string[];
}
