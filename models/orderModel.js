const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    items: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
        }
    }],
    time: {
        type: Date,
        default: Date.now()
    },
    total_amount: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled']
    },
});

module.exports = mongoose.model('Order', orderSchema);

