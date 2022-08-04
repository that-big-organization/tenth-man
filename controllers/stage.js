const Conversation = require("../models/conversation")
// const User = require("../models/user")
const section = require("./section")


module.exports = async function stager(body, conversation, user) {
    console.log(`Message: ${body.Body}`)
    // if theres no conversation and no user create conversation with on bording
    if (!conversation && !user) conversation = Conversation.createConvo(body, null)
    if (!conversation && user) conversation = Conversation.createConvo(body, user)
    const response = await section[conversation.sessionInfo.stage][conversation.sessionInfo.function](body, conversation, user)
    console.log("before save")
    await response.save()
    console.log("after save")
    console.log(`Response: ${response.message}`)
    return response.message
}

