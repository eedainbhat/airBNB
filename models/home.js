const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/databaseUtil");

module.exports = class Home {
    constructor(name, price, location, photo, description) {
        this.name = name;
        this.price = price;
        this.location = location;
        this.photo = photo;
        this.description = description;
    }

    save() {
        const db = getDb();
        return db.collection('homes').insertOne(this);
    };

    static fetchAll() {
        const db = getDb();
        return db.collection('homes').find().toArray();
    }

    static findById(homeId) {
        const db = getDb();
        return db.collection('homes').find({_id: new ObjectId(String(homeId))}).next();
    }

    static updateHome(homeId, updatedData) {
        const db = getDb();
        return db.collection('homes').updateOne({_id: new ObjectId(String(homeId))}, {$set: updatedData })
        
    } 

    static deleteHome(homeId) {
        const db = getDb();
        return db.collection('homes').deleteOne({_id: new ObjectId(String(homeId))});
    }
}