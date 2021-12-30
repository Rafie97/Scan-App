export default interface User {
  id: string;
  name: string;
  family?: string[];
  wishlists?: Wishlist[];
}

export interface Wishlist {
  id: string;
  items: string[];
}
