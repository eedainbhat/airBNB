const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/databaseUtil");


module.exports = class Favorites {
    constructor(homeId) {
        this.homeId = homeId;
    }

    save() {
            const db = getDb();
            return db.collection('favourites').insertOne(this);
    }

    static getFavorites() {
        const db = getDb();
        return db.collection('favourites').find().toArray();
    }

    static deleteFavourite(homeId) {
        const db = getDb();
        return db.collection('favourites').deleteOne({ homeId: String(homeId) });
    }

    static findFavourite(homeId) {
        const db = getDb();
        return db.collection('favourites').findOne({ homeId: String(homeId)  });   
    }
}