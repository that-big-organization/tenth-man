const mongoose = require('mongoose');
const { Schema } = mongoose;
const Geo = require('../lib/geo')
const GT = require('./geo')

const area = {
    type: {
        type: String,
        enum: ["Polygon"],
        required: false,
    },
    coordinates: [[[Number]]]
}
const geoType = GT.clone().add({ area })

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    geo: geoType,
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
            async notify() {
                if (this.contact.email) {
                    //send email
                }
                if (this.contact.sms) {
                    //send sms
                }
                if (this.contact.whatsapp) {
                    //send whatsapp message
                }
            },
            async generateGeo() {

            }
        },
        static: {

        }
    }
)

module.exports = mongoose.model('User', userSchema)