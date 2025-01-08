const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        unique:true,
    },

    description: {
        type: String,
        required:true,
    },

    price: {
        type: Number,
        required:true,
        default:0
    },

    category: {
        type :mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }, 

    image: {
        type: String
    }

});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;