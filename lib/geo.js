const axios = require('axios')


class Geo {
    // lng,lat
    constructor(address, options) {
        this.address = address
        this.location = { type: "Point", coordinates: options.location.coordinates || undefined }
        this.distance = options.distance || { value: 5, type: "km" }
        this.region = options.region || undefined
    }
    area() {
        let radius = this.distance.value
        if (this.distance.type != "km") {
            radius = radius * 1.60934
        }
        const d2r = Math.PI / 180;
        const r2d = 180 / Math.PI;
        const cLat = (radius / 6371) * r2d;
        const cLng = cLat / Math.cos(this.coordinates[1] * d2r);
        const points = [];
        for (let i = 0; i < 360; i += 360 / 18) {
            const theta = Math.PI * (i / 180);
            const circleY = this.coordinates[0] + (cLng * Math.cos(theta));
            const circleX = this.coordinates[1] + (cLat * Math.sin(theta));
            points.push([circleX, circleY]);
        }
        points.push(points[0]);
        this.area = { type: "polygon", coordinates: points } 
    }
    // setter to change max distance they'r willing to travel and to recalculate area
    set setDistance(value) {
        // change distane
        this.distance.value = value
        // reset area
        this.area = this.area()
    }
    static async getLocation(address, distance = { type: "km", value: 5 }) {
        const result = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: {
                address: address,
                key: process.env.MAPS,
                // language: language,
                components: "country:US"
            }
        }).then(r => r.data.results)
        if (!result[0]) return null
        if (result.length == 1) return new Geo(...this._format(result[0]))
        return result.map(r => new Geo(...this._format(r)))
    }
    static _format(result) {
        // we're looking form "administrative_area_level_1" to lock down a region
        /*
        address_components[Object]
            long_name:String
            short_name:String
            types[String]
        formatted_addres:String
        geometry{Object}
            bounds{Object}
                northeast{Geo Object}
                southwest {Geo Object}
            location{Geo Object}
            location_type:String
            viewport{Object}
                northeast{Geo Object}
                southwest{Geo Object}
        place_id:String
       */

        const coor = result.geometry.location

        const options = {
            location: {
                type: "Point",
                coordinates: [coor.lng, coor.lat]
            }
        }

        for (let adds of result.address_components) {
            if (adds.types.includes("administrative_area_level_1")) {
                options["region"] = adds.long_name
            }
        }
        return [result.formatted_address, options]
    }
    // get distance between 2 places generally used for events
    getDistance([lng, lat]) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat - this.coordinates.lat); // deg2rad below
        const dLon = deg2rad(lng - this.coordinates.lng);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(this.coordinates.lat)) * Math.cos(deg2rad(lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    distanceMiles(coor) {
        return this.getDistanceKM(coor) * 1.609
    }
}

module.exports = Geo