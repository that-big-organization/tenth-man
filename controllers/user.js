const User = require('../models/user')
const Geo = require('../lib/geo')

class UserCtrl {
    static async register(req, res, next) {
        const { body } = req
        const { geo } = body
        if (!geo.location && geo.address) {
            const result = await Geo.getLocation(geo.address)
            if (result[0]) body.geo = result[0]
            body.geo = result
        }
        const user = new User(body)
        try {
            await user.save()
            res.json(user)
        }
        catch (err) {
            console.log(err)
            res.json({ error: "Unable to create user" })
        }
    }
    static async getUser(req, res, next) {
        const { id } = req.params
        try {
            const user = await User.findById(id)
            if (!user) { res.json({ status: 404 }) }
            else {
                res.json(user)
            }
        } catch (err) {
            res.json(err)
        }
    }
    static async delete(req, res, next) {
        const { id } = req.params
        try {
            await User.findByIdAndDelete(id)
            res.send(`User ${id} was deleted`)
        } catch (err) {
            console.log(err)
            res.json("unable to delete user.")
        }
    }
    static async save(req, res, next) {
        const { id } = req.params
        const { body } = req
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