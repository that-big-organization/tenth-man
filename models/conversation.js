const mongoose = require('mongoose')
const { Schema } = mongoose

const sessionSchema = new Schema({
    createAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 3600
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    storyBoard: String,
    platform: String,
    sessionInfo: {
        stage: String,
        function: Number,
        addresses: []
    }


}, {
    methods: {
        bumpFunction() {
            this.sessionInfo.function += 1
            this.markModified("sessionInfo.function")
        }
    },
    statics: {
        createConvo(body, user, stage = "lobby") {
            const platform = body.From.split(":")[0]
            if (!user) return new mongoose.model("Conversation")({ platform, storyBoard: body.From, sessionInfo: { stage: "onBoarding", function: 0 } })
            return new mongoose.model("Conversation")({ platform, storyBoard: body.From, user, sessionInfo: { stage, function: 0 } })
        },
    }

})

module.exports = mongoose.model('Conversation', sessionSchema)