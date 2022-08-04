module.exports = class Response {
    #message
    #user
    #conversation
    constructor(message, conversation, user) {
        this.#message = message;
        this.#user = user;
        this.#conversation = conversation;
    }

    get message() {
        return this.#message;
    }

    get user() {
        return this.#user;
    }

    get conversation() {
        return this.#conversation;
    }

    async saveSession() {
        if (this.#conversation) {
            return this.#conversation.save()
        }
    }
    async saveUser() {
        if (this.#user) {
            return this.#user.save()
        }

    }
    async save() {
        if (this.#user) {
            console.log("befor save user")
            await this.#user.save()
        }
        if (this.#conversation) {
            await this.#conversation.save()
        }
        return this
    }

    log() {
        console.log(`Message: ${this.#message}\n`)
        console.log(`User: ${this.#user}\n`)
        console.log(`Conversation: ${this.#conversation}\n`)

    }
}