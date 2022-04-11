const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Name is Missing'],
        unique: true
    },
    duration: {
        type: Number,
        require: [true, 'Duration is Missing']
    },
    maxGroupSize: {
        type: Number,
        require: [true, 'Must have a group size']
    },
    difficulty: {
        type: String,
        require: [true, 'Difficulty is missing']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        require: [true, 'Price is Missing']
    },
    summary: {
        type: String,
        require: [true, 'Summary is Missing']
    },
    description: {
        type: String,
        require: [true, 'Description is Missing']
    },
    imageCover: {
        type: String,
        require: [true, 'Must require image cover']
    },
    images: [String],
    startDates: [Date],
    rating: {
        type: Number,
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

TourSchema.virtual('durationWeek').get(function () {
    return this.duration / 7;
})

const Tours = mongoose.model('Tours', TourSchema);

module.exports = Tours;