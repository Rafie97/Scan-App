import Receipt from '../CartModels/Receipt';

export default interface User {
  id: string;
  name: string;
  family?: string[];
  wishlists?: Wishlist[];
  receipts?: Receipt[];
}

export interface Wishlist {
  id: string;
  items: string[];
}
