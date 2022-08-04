const stager = require('../controllers/stage')
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const User = require('../models/user')
const Conversation = require('../models/conversation')


module.exports = async function whatsapp(req, res) {
    const { From } = req.body
    // look for user
    const user = await User.findOne({ ["contact.whatsapp.value"]: From })
    //look for conversation
    // storyBoard is the id for sessions interacting with chats that use this function
    const conversation = await Conversation.findOne({ storyBoard: From })


    const twiml = new MessagingResponse();
    // get the return message from stger that controls state 
    return twiml.message(stager(req.body, conversation, user));

    //send back stuffs
    // res.writeHead(200, { 'Content-Type': 'text/xml' });
    // res.end(twiml.toString())
}