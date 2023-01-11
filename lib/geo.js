const axios = require('axios')

class Geo {
    constructor(geo) {
        if (!geo.address) throw new Error("No Address Provided")
        this.address = geo.address
        this.location = geo.location || { type: "Point" }
        geo.region && (this.region = geo.region)
        geo.area && (this.area = geo.area)
    }
    static async getCoordinates({ address }) {
        return axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: {
                address: address,
                key: process.env.MAPS,
                // language: language,
                components: "country:US"
            }
        })
            .then(r => r.data.results)
            .then(r => {
                if (!r[0]) throw new Error("no results")
                if (r.length == 1) return Geo.format(r[0])
                return r.map(r => Geo.format(r))
            })
            .catch(err => {
                console.log(err)
                return undefined
            })
    }
    static format(result) {
        // we're looking form "administrative_area_level_1" to lock down a region

        const coordinates = result.geometry.location

        const geo = {
            address: result.formatted_address,
            location: {
                type: "Point",
                coordinates: [coordinates.lng, coordinates.lat]
            }
        }

        for (let adds of result.address_components) {
            if (adds.types.includes("administrative_area_level_1")) {
                geo["region"] = adds.long_name
            }
        }
        return new Geo(geo)
    }
    setArea(radius = 5) {
        const d2r = Math.PI / 180;
        const r2d = 180 / Math.PI;
        const cLat = (radius / 6371) * r2d;
        const cLng = cLat / Math.cos(this.location.coordinates[1] * d2r);
        const points = [];
        for (let i = 0; i < 360; i += 360 / 18) {
            const theta = Math.PI * (i / 180);
            const circleY = this.location.coordinates[0] + (cLng * Math.cos(theta));
            const circleX = this.location.coordinates[1] + (cLat * Math.sin(theta));
            points.push([circleX, circleY]);
        }
        points.push(points[0]);
        this.area = { type: "Polygon", coordinates: points }
        return this;
    }
    static milesToKilometers(miles) {
        return miles * 1.60934;
    }
    getDistance(lng, lat) {
        if (!this.location.coordinates) return undefined;
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat - this.location.coordinates.lat); // deg2rad below
        const dLon = deg2rad(lng - this.location.coordinates.lng);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(this.location.coordinates.lat)) * Math.cos(deg2rad(lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

}

module.exports = Geo