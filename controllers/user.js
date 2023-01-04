const User = require('../models/user')

class UserCtrl {
    static async register(req, res, next) {
        const { body } = req
        const user = new User(body.user)
        try {
            await user.save()
            res.json(user)
        }
        catch (err) {
            console.log(err)
            res.json({ error: "Unable to create user" })
        }

    }
    static async login(req, res, next) { }
    static async logout(req, res, next) { }
    static async delete(req, res, next) {
        const { id } = req.query
        console.log(`Deleteing ${id}`)
        const user = await User.findByIdAndDelete(id)
        console.log(user)
        res.send(`User ${id} was deleted`)
    }
    static async save(req, res, next) {
        const { id } = req.query
        console.log(id)
        const { body } = req
        console.log(body)
        const user = await User.findByIdAndUpdate(id, body, { new: true })

        try {
            await user.save()
            res.json(user)
        }
        catch (err) {
            console.log(err)
            res.send(err)
        }
    }
    static async generateLoginCode(req, res, next) {
        const { platform, contact } = req.body
        const code = Math.floor(Math.random() * 999999)
        const proprty = `contact.${platform}.value`
        const q = {}
        q[proprty] = contact
        const user = await User.findOne(q)
        if (!user) res.json("no show")
        if (user) res.json(code)
    }
}

module.exports = UserCtrl