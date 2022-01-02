export default interface Receipt {
  id: string;
  date: string;
  storeId: string;
  amountDue: number;
  items: string[];
  paidFullAmount: boolean;
}
