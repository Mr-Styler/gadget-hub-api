const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        unique: true,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    tags: [
        {
            type: String
        }
    ]
});

module.exports = mongoose.model('Product', productSchema);