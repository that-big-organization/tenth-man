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
    area: {
        type: {
            type: String,
            enum: ["Polygon"],
            required: false,
            default: "Polygon"
        },
        coordinates: [[[{ type: Number, required: false }]]]
    },
    region: String,
    address: String,
})

module.exports = geoType