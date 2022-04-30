import {Review} from './Review';

interface ItemInterface {
  barcode: string;
  category?: string;
  docID: string;
  feeds?: number;
  imageLink: string;
  location: Location;
  name: string;
  price: number;
  priceHistory?: Map<string, number>;
  promo: boolean;
  quantity: number;
  reviews: Review[];
  isRecipe: boolean;
}

class Item implements ItemInterface {
  barcode: string;
  category?: string;
  docID: string;
  feeds?: number;
  imageLink: string;
  location: Location;
  name: string;
  price: number;
  priceHistory?: Map<string, number>;
  promo: boolean;
  quantity: number;
  reviews: Review[];
  isRecipe: boolean;

  constructor(doc) {
    if (typeof doc.data === 'function') {
      this.barcode = doc.data().barcode;
      this.category = doc.data().category;
      this.docID = doc.id;
      this.feeds = doc.data().feeds;
      this.imageLink = doc.data().imageLink;
      this.location = doc.data().location;
      this.name = doc.data().name;
      this.price = doc.data().price;
      this.priceHistory = convertPriceHistory(doc.data().priceHistory);
      this.promo = doc.data().promo;
      this.quantity = doc.data().quantity;
      this.reviews = doc.data().reviews;
      this.isRecipe = doc.data().isRecipe;
    } else {
      this.barcode = doc.barcode;
      this.category = doc.category;
      this.docID = doc.docID;
      this.feeds = doc.data().feeds;
      this.imageLink = doc.imageLink;
      this.location = doc.location;
      this.name = doc.name;
      this.price = doc.price;
      this.priceHistory = convertPriceHistory(doc.priceHistory);
      this.promo = doc.promo;
      this.quantity = doc.data().quantity;
      this.reviews = doc.reviews;
      this.isRecipe = doc.data().isRecipe;
    }
  }
}

export default Item;

function convertPriceHistory(firebasePriceHistory: {
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
