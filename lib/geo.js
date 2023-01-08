const axios = require('axios')


class Geo {
    #area
    #distance
    #coordinates
    constructor(address, distance) {
        //coordinates of the specific address 
        this.#coordinates = address.coordinates
        // region  of the address generally city or province
        this.region = address.region
        // formatted address in string form
        this.address = address.address || null
        // distance the person is willing to travel
        this.#distance = address.distance || distance
        // the circumfrance point from the distance 
        this.#area = this._area()

    }
    // get the area of limit circle
    _area() {
        //return the array of points that make the area
        //Degrees to radians
        let radius = this.#distance.value
        if (this.#distance.type != "km") {
            radius = radius * 1.60934
        }
        const d2r = Math.PI / 180;
        //  Radians to degrees
        const r2d = 180 / Math.PI;
        // Earth radius is 3,963 miles
        const cLat = (radius / 6371) * r2d;
        const cLng = cLat / Math.cos(this.#coordinates.lat * d2r);
        //Store points in array
        const points = [];
        // Calculate the points
        // Work around 360 points on circle
        for (let i = 0; i < 360; i += 360 / 18) {
            const theta = Math.PI * (i / 180);
            // Calculate next X point
            const circleY = this.#coordinates.lng + (cLng * Math.cos(theta));
            //console.log("CircleY:"+circleY);
            // Calculate next Y point
            const circleX = this.#coordinates.lat + (cLat * Math.sin(theta));
            //console.log("circleX:"+circleX);
            // Add point to array
            points.push([circleX, circleY]);

        }
        points.push(points[0]);
        return points
    }
    // getter for the max distance they're willing to travel
    get distance() {
        return this.#distance
    }
    // setter to change max distance they'r willing to travel and to recalculate area
    set distance(value) {
        // change distane
        this.#distance.value = value
        // reset area
        this.#area = this._area()
    }
    // formatting the info to go right into the user
    get userInfo() {
        /*
            location:lng:lat
            area:lng:lrt
            distance:value,type
            region

        */
        return {
            area: {
                type: "Polygon",
                coordinates: this.#area
            },
            location: {
                type: "Point",
                coordinates: [this.#coordinates.lat, this.#coordinates.lng]
            },
            distance: this.#distance,
            region: this.region
        }
    }
    // getting org near the place to get a minyan thru them
    getOrg() {
        // find org near address
    }
    // input address returns geo info
    static async getLocation(address, distance = { type: "km", value: 5 }) {
        const result = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: {
                address: address,
                // key: ,
                // language: language,
                components: "country:US"
            }
        }).then(r => r.data.results)
        if (!result[0]) return null



        return result.map(r => new Geo(this._format(r), distance))
    }
    // internal method to format result from getLocation
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

        const address = {
            address: result.formatted_address,
            coordinates: result.geometry.location,
            id: result.place_id


        }

        for (let adds of result.address_components) {
            if (adds.types.includes("administrative_area_level_1")) {
                address["region"] = adds.long_name
            }
        }
        return address
    }
    // get distance between 2 places generally used for events
    getDistance([lat, lng]) {
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


    static createFromUser(info) {
        return new Geo({
            coordinates: { lat: info.location.coordinates[0], lng: info.location.coordinates[1] },
            distance: info.distance,
            region: info.region
        })

    }


}

module.exports = Geo