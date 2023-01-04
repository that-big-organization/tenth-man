const Org = require('../models/organization')
const Event = require('../models/event')


class OrgCtrl {
    static async createOrg(req, res, next) {
        const { body } = req;
        const org = new Org(body)
        try {
            await org.save()
            res.json(org)
        }
        catch (err) {
            res.json(err)
        }
    }
    static async getOrg(req, res, next) {
        const { id } = req.params
        console.log(id)
        const org = await Org.findById(id)

        if (!org)
            res.json("Not Found")
        else
            res.json(org)
    }
    static async updateOrg(req, res, next) {
        const { id } = req.params
        console.log(id)
        const { body } = req
        const org = await Org.findByIdAndUpdate(id, body, { new: true })

        try {
            await org.save()
            res.json(org)
        }
        catch (err) {
            console.log(err)
            res.send(err)
        }
    }
    static async deleteOrg(req, res, next) {
        const { id } = req.query
        console.log(`Deleteing ${id}`)
        const org = await org.findByIdAndDelete(id)
        console.log(org)
        res.send(`Org ${id} was deleted`)
    }
    static async getEvents(req, res, next) {
    }
    static async createEvent(req, res, next) {
        const { body } = req
        const event = new Event(body)
        await event.save()
    }
    static async getEvent(req, res, next) {
        const { id } = req.params
        const event = await Event.findById(id)
        res.json(event)

    }
    static async eventForm(req, res, next) {
        // send email
    }
    static async orgForm(req, res, next) {
        // send email
    }
    static async editEvent(req, res, next) {
        const { body } = req.body
        const event = await Event.findByIdAndUpdate(body, { new: true })
        await event.save()
        res
    }
    static async deleteOrg(req, res, next) {
        const { id } = req.params
        const org = await Org.findByIdAndDelete(id)
        res.json(`Account ${id} has been deleted`)
    }
    static async orgNearMe(req, res, next) { }
    static async getAllOrg(req, res, next) { }

}

module.exports = OrgCtrl