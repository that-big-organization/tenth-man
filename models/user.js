const mongoose = require('mongoose');
const { Schema } = mongoose;
const Geo = require('../lib/geo')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
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
    distance: {
        type: {
            type: String,
            enum: ["ml", "km"]
        },
        value: {
            type: Number,
            default: 5
        }
    },
    region: String,
    blocked: Boolean,
    contact: {
        email: {
            value: {
                type: String,
                index: true,
                sparse: true,
                unique: true,
                lowercase: true,
                trim: true,
            },
            verified: {
                type: String,
                default: false
            },
        },

        whatsapp: {
            value: {
                type: String,
                index: true,
                sparse: true,
                unique: true,
                lowercase: true,
                trim: true,
            },
            verified: {
                type: String,
                default: false
            },
        },
        sms: {
            value: {
                type: String,
                index: true,
                sparse: true,
                unique: true,
                lowercase: true,
                trim: true,
            },
            verified: {
                type: String,
                default: false
            },
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],

    notifications: {
        max: {
            type: Number,
            required: true,
            default: 3
        },
        current: {
            type: Number,
            required: true,
            default: 0
        }
    }
},
    {
        methods: {

        }
    }
)



module.exports = mongoose.model('User', userSchema)