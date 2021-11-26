import Item from './Item';
export interface Recipe extends Item {
  category?: string;
  feeds?: number;
}
