import {Review} from './Review';

class Item {
  barcode: string;
  category?: string;
  docID: string;
  imageLink: string;
  location: Location;
  name: string;
  price: number;
  priceHistory?: Map<string, number>;
  promo: boolean;
  quantity?: number;
  reviews: Review[];
  stock?: number;
  isRecipe: boolean;

  constructor(doc) {
    if (typeof doc.data === 'function') {
      this.barcode = doc.data().barcode;
      this.category = doc.data().category;
      this.docID = doc.id;
      this.imageLink = doc.data().imageLink;
      this.isRecipe = doc.data().isRecipe;
      this.location = doc.data().location;
      this.name = doc.data().name;
      this.price = doc.data().price;
      this.priceHistory = convertPriceHistory(doc.data().priceHistory);
      this.promo = doc.data().promo;
      this.quantity = doc.data().quantity;
      this.reviews = doc.data().reviews;
      this.stock = doc.data().stock;
    } else {
      this.barcode = doc.barcode;
      this.category = doc.category;
      this.docID = doc.docID;
      this.imageLink = doc.imageLink;
      this.isRecipe = doc.isRecipe;
      this.location = doc.location;
      this.name = doc.name;
      this.price = doc.price;
      this.priceHistory = convertPriceHistory(doc.priceHistory);
      this.promo = doc.promo;
      this.quantity = doc.quantity;
      this.reviews = doc.reviews;
      this.stock = doc.stock;
    }
  }
}

export default Item;

export function convertPriceHistory(firebasePriceHistory: {
  timestamp: number;
}): Map<string, number> {
  let priceHist = new Map<string, number>();
  if (firebasePriceHistory) {
    Object.entries(firebasePriceHistory)
      .reverse()
      .forEach(entry => {
        const [key, value] = entry;
        priceHist.set(key, value);
      });

    return priceHist;
  } else {
    return null;
  }
}
