const path = require('path');
const rootDir = require('../utils/pathUtil');
const fs = require('fs');
const homelist = [];

module.exports = class Home {
    constructor(name, price, location, photo) {
        this.name = name;
        this.price = price;
        this.location = location;
        this.photo = photo;
    }

    save() {
        Home.fetchAll((homelist) => {
            this.id = Math.random().toString();
            homelist.push(this);
            const filePath = path.join(rootDir, 'data', 'homes.json');
            fs.writeFile(filePath, JSON.stringify(homelist), (err) => {
                console.log('error:', err);
            })
        });
    };
    static fetchAll(callback) {
        const homeDataPath = path.join(rootDir, 'data', 'homes.json');
        fs.readFile(homeDataPath, (err, data) => {
            callback(!err ? JSON.parse(data) : []);
        });
    }

    static findById(homeId, callback) {
        this.fetchAll((homes) => {
            const home = homes.find(home => home.id === homeId);
            callback(home);
        })
    }
}