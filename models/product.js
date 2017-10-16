var mongoose = require('mongoose');

// Product Schema
var productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imageURL: {
        type: String,
        required: false
    }
});

var Product = module.exports = mongoose.model('Product', productSchema);

// Get Products
module.exports.getProducts = function(callback, limit) {
    Product.find(callback).limit(limit);
}

// Get Product
module.exports.getProductById = function(id, callback) {
    Product.findById(id, callback);
}

// Add Product
module.exports.addProduct = function(product, callback) {
    Product.create(product, callback);
}

// Update Product
module.exports.updateProduct = function(id, product, options, callback) {
    var query = {
        _id: id
    };
    var update = {
        name: product.name,
        price: product.price,
        stock: product.stock,
        imageURL: product.imageURL
    }
    Product.findOneAndUpdate(query, update, options, callback);
}

// Delete Product
module.exports.removeProduct = function(id, callback) {
    var query = {
        _id: id
    };
    Product.remove(query, callback);
}
