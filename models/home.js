const path = require('path');
const rootDir = require('../utils/pathUtil');
const fs = require('fs');

const filePath = path.join(rootDir, 'data', 'homes.json');

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
            fs.writeFile(filePath, JSON.stringify(homelist), (err) => {
                console.log('error:', err);
            })
        });
    };
    static fetchAll(callback) {
        fs.readFile(filePath, (err, data) => {
            callback(!err ? JSON.parse(data) : []);
        });
    }

    static findById(homeId, callback) {
        this.fetchAll((homes) => {
            const home = homes.find(home => home.id === homeId);
            callback(home);
        })
    }

    static updateHome(homeId, updatedData, callback) {
        this.fetchAll((homelist) => {
            const homeIndex = homelist.findIndex(home => home.id === homeId);
            updatedData.id = homeId
            homelist[homeIndex] = updatedData
            fs.writeFile(filePath, JSON.stringify(homelist), (err) => {
                if (err) {
                    console.log("err:", err);
                } else if (callback) {
                    callback();
                }
            })
        })
    }

    static deleteHome(homeId, callback) {
        this.fetchAll((homelist) => {
            const homeIndex = homelist.findIndex(home => home.id === homeId);
            homelist.splice(homeIndex, 1);
            fs.writeFile(filePath, JSON.stringify(homelist), (err) => {
                if (err) {
                    console.log("err:", err);
                } else if (callback) {
                    callback()
                }
            }
            )
        })
    }
}