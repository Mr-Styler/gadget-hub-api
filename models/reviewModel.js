const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String
    },
    rating: {
        type: Number,
        max: 5,
        min: 1
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
},
{timestamps: true})

reviewSchema.pre(/^find/, function (next) {
    this.populate({path: 'userId', select: 'name'})
    this.populate({path: 'article', select: 'title author'})

    next();
})

module.exports = mongoose.model('Review', reviewSchema);