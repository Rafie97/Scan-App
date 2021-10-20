import {Review} from './Review';

interface ItemInterface {
  barcode: string;
  docID: string;
  name: string;
  imageLink: string;
  location: Location;
  price: number;
  priceHistory: [string, number];
  promo: boolean;
  reviews: Review[];
}

class Item implements ItemInterface {
  barcode: string;
  docID: string;
  name: string;
  imageLink: string;
  location: Location;
  price: number;
  priceHistory: [string, number];
  promo: boolean;
  reviews: Review[];

  constructor(doc) {
    if (typeof doc.data == 'function') {
      this.docID = doc.id;
      this.name = doc.data().name;
      this.price = doc.data().price;
      this.imageLink = doc.data().imageLink;
      this.barcode = doc.data().barcode;
      this.promo = doc.data().promo;
      this.reviews = doc.data().reviews;
      this.priceHistory = doc.data().priceHistory;
      this.location = doc.data().location;
    } else {
      this.docID = doc.docID;
      this.name = doc.name;
      this.price = doc.price;
      this.imageLink = doc.imageLink;
      this.barcode = doc.barcode;
      this.promo = doc.promo;
      this.reviews = doc.reviews;
      this.priceHistory = doc.priceHistory;
      this.location = doc.location;
    }
  }

  toString() {
    return (
      this.docID +
      ',' +
      this.name +
      ',' +
      this.price +
      ',' +
      this.imageLink +
      ',' +
      this.barcode +
      ',' +
      this.promo +
      ',' +
      this.reviews +
      ',' +
      this.priceHistory
    );
  }
}

export default Item;
