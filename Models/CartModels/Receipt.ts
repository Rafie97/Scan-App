export default interface Receipt {
  id: string;
  date: string;
  storeId: string;
  amount: number;
  items: string[];
  paidFullAmount: boolean;
}
