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
            required: true,
            default: "Polygon"
        },
        coordinates: [[[Number]]]
    },
    region: String,
    address: String,
})

module.exports = geoType