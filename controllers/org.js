const Org = require('../models/organization')
const Event = require('../models/event')
const Geo = require('../lib/geo')


class OrgCtrl {
    static async createOrg(req, res, next) {
        const { body } = req;
        const { geo } = body
        try {
            if (!geo.location && geo.address) {
                const result = await Geo.getLocation(geo.address)
                if (result[0]) body.geo = result[0]
                body.geo = result
            }
            const org = new Org(body)
            await org.save()
            res.json(org)
        }
        catch (err) {
            console.log(err)
            res.json("Hi")
        }
    }
    static async getOrg(req, res, next) {
        const { id } = req.params
        const org = await Org.findById(id)
        if (!org)
            res.json("Not Found")
        else
            res.json(org)
    }
    static async updateOrg(req, res, next) {
        const { id } = req.params
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
        const { id } = req.params
        const events = await Org.findById(id, ["events", "-_id"]).populate("events")
        res.json(events)

    }
    static async createEvent(req, res, next) {
        const { body } = req
        const { id } = req.params
        const org = await Org.findById(id)
        if (!org) {
            res.json("Organization not found")
            return
        }
        const event = await org.createEvent(body)
        console.log(event)
        res.json(event)
    }
    static async getEvent(req, res, next) {
        const { id } = req.params
        const event = await Event.findById(id)
        res.json(event)

    }
    static async editEvent(req, res, next) {
        const { body } = req.body
        const event = await Event.findByIdAndUpdate(body, { new: true })
        await event.save()
        res.json(event)
    }
    static async deleteOrg(req, res, next) {
        const { id } = req.params
        const org = await Org.findByIdAndDelete(id)
        res.json(`Account ${id} has been deleted`)
    }
    static async orgNearMe(req, res, next) {
        const { location } = req.query
        if (!location) res.json("Bad request")
        const [lat, lng] = location.split(",")
        const query = {
            location: {
                $geoIntersects: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat],
                    },
                },
            },
        }
        const orgs = await Org.find(query).populate("organization")

        res.send(orgs)
    }
    static async getAllOrg(req, res, next) { }

}

module.exports = OrgCtrl