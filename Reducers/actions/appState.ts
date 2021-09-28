import Item from '../../Models/Item';

export const setProducts = (products: Item[]) => ({
  type: 'SET_PRODUCTS',
  payload: products,
});