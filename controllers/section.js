const Response = require("../lib/responce")
const Geo = require("../lib/geo")
const User = require("../models/user")

module.exports = {
    onBoarding: [
        async (body, conversation, user) => {
            conversation.bumpFunction()
            return new Response("Would you like to sign up?", conversation, user)
        },
        async (body, conversation, user) => {
            let message;
            if (body.Body.toLowerCase() === "yes") {
                message = "Ok! Please enter a valid address"
                conversation.bumpFunction()
            } else {
                message = "Oh well I guess you dont wanna join if we are wrong please reply with yes"
            }
            return new Response(message, conversation, user)
        },
        async (body, conversation, user) => {
            let message = ""
            const addresses = await Geo.getLocation(body.Body)
            if (!addresses) {
                return new Response("Oops looks like we had a hickup. can you please eneter a more specific address", conversation, user)
            }
            addresses.forEach((element, index) => { message += `${index + 1}. ${element.address}\n` })
            conversation.bumpFunction()
            conversation.sessionInfo.addresses = addresses.map(address => address.userInfo)
            // conversation.markModified('sessionInfo', 'sessionInfo.function', 'sessionInfo.addresses')
            return new Response(message, conversation, user)
        },
        async (body, conversation, user) => {

            const number = parseInt(body.Body) - 1

            if (isNaN(number) || number >= 5) {
                // check if they wanna go back if so go back and reask 
                if (body.Body.toLowerCase() == "back") {
                    conversation.sessionInfo.function = 2
                    return new Response("Ok! Please enter a valid address", conversation, user)
                }
                // if dont make sense then return what was that 
                return new Response("please retry or say back", conversation, user)
            }

            // get geo infoformtion
            try {

                const geo = Geo.createFromUser(conversation.sessionInfo.addresses[number])
                user = new User(geo.userInfo)
            }
            catch (e) {
                return new Response("valid stuffs", conversation, user)
            }
            // get whatsapp info from body
            user.name = body.ProfileName
            user.contact.whatsapp = { verified: true, value: body.From }
            //delete conversation
            await conversation.remove()
            return new Response("Great we saved your information", null, user)
        }
    ],
    lobby: [
        (body, conversation, user) => {
            const message = require("../controllers/validate")(body.Body)
            if (!message) return new Response("oops didnt quite get that", conversation, user)
            if (typeof message === "string") {
                conversation.stage = message
            }
            return new Response(body, conversation, user)
        }
    ],
    exit: [],
    distance: [],
    notifications: [],
}