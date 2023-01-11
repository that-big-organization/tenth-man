const mongoose = require('mongoose');

const geoType = new mongoose.Schema({
    location: {
        type: {
            type: String,
            required: true,
            default: "Point"
        },
        coordinates: [{
            type: Number,
            required: true,
        }]
    },
    region: String,
    address: String,
})

module.exports = geoType