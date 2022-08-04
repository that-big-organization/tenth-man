module.exports = class Verify {
    #code
    #user
    constructor(user, method, code) {
        this.#user = user
        this.method = method
        if (!code) {
            //generate code
        }
        else {
            this.#code = code
        }
    }

    static _generateCode() {
        //genrate code
        //send code
        //save code
    }

    static async whatsapp() {
        //_generate code 
        //save method
    }

    static async email() {
        //_generate code 
        //save method
    }

    static async sms() {
        //_generate code 
        //save method
    }

}