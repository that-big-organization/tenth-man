const mongoose = require('mongoose');
const { createEvent } = require('../controllers/org');
const { Schema } = mongoose
const Event = require('./event')
const geoType = require('./geo')

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    contact: {
        phone: String,
        whatsapp: String,
        email: String
    },
    domain: {
        url: {
            type: String,
            required: true,
            trim: true,
            index: true,
            unique: true
        },
        verificationEmail: {
            type: Boolean,
            default: false,
        },
        verified: {
            type: Boolean,
            default: false,
        }
    },
    permissions: {
        allowDomain: {
            type: Boolean,
            required: true,
            default: false,
        },
        blockedEmails: [String],
    },
    users: [{
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        blocked: {
            type: Boolean,
            default: false
        }


    }],
    geo: geoType,
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    owner: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        unique: true,
        immutable: true,
        //validate this is an email
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        methods: {
            addUser(email) { this.users.push(email) },
            blockUser(email) { this.blocked.push(email) },
            async createEvent(body) {
                const event = new Event(body)
                event.organization = this
                this.events.push(event)
                try {
                    await event.save().then(() => this.save())
                    return event
                }
                catch (err) {
                    return err
                }
            },
        }
    })

// organizationSchema.virtual("addDomain").set()

module.exports = mongoose.model('Organization', organizationSchema)




