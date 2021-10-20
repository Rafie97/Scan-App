import Item from './Item';

export type CartItem = {
  baseItem: Item;
  quantity: number;
  stock?: number;
};
