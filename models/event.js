const mongoose = require('mongoose');
const { Schema } = mongoose;
const Geo = require('../lib/geo')
const User = require('./user')

const eventSchema = new Schema({
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
    region: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    instructions: String,
    person: {
        name: {
            type: String,
            required: true,
        },
        dod: {
            type: Date,
            required: false,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    users: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        notified: {
            type: Boolean,
            default: false
        },
        time: Date,
        attending: Boolean
    }],
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    notifiedUsers: Number
},
    {
        methods: {
            async nearbyUsers() {
                const users = await User.find()
                users.map((user) => { this.users.push({ user }) })
            },
            async notifyUsers(increase = 3) {
                if (this.notifiedUsers) {
                    increase = 10
                }
                const notify = this.users.filter(user => !user.notified)
                for (let i = 0; i < increase.length; i++) {
                    await user.user.notify()
                }
            }
        }
    }
)

eventSchema.virtual("attendingUsers").get(() => { this.users.map((user) => { if (user.attending) return user }) })
eventSchema.pre('save', async () => {
    await this.nearbyUsers()
})
eventSchema.post('save', async () => {
    await this.notifyUsers
})

module.exports = mongoose.model('Event', eventSchema)