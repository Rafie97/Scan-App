import React from 'react';

var mongoose = require('mongoose');

var schema= mongoose.Schema;

var ItemSchema = new Schema(
    {
        item_name: {type: String, required:true, max:100},
        price: {type:String, required:true, max:6 },
        imageLink: {type:String, required:true, max:1000 }
    }
);

ItemSchema.virtual('name').get(function(){

    var name = '';
    return name;
});

ItemSchema.virtual('price').get(function() {
    price = '';
    return price;
});



module.exports= mongoose.model('Item', ItemSchema);