// this file is for the schema of the dishes collection which stores the documents 
// for each dishes
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
// this will load this new currency type into mongoose
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
}, { 
    usePushEach: true
});

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    label: {
        type: String,
        default: ''
    },

    price: {
        type: Currency,
        required: true,
        min: 0
    },

    featured: {
        type: Boolean,
        default: false
    },

    comments: [commentSchema] // comments document becomes subdocument inside the dish schema
},{
    timestamps: true
    // this will add created at and updated at timestamps into each document
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;