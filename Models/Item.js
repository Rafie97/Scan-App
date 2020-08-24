class Item {
    constructor(docID, name, price, imageLink, barcode, promo, reviews){
        this.docID = docID;
        this.name = name;
        this.price = price;
        this.imageLink = imageLink;
        this.barcode = barcode;
        this.promo = promo;
        this.reviews = reviews;
    }

    toString(){
        return this.docID + ',' + this.name + ',' + this.price + ',' + this.imageLink + ',' + this.barcode + ',' + this.promo + ',' + this.reviews;
    }

}


export default Item;
