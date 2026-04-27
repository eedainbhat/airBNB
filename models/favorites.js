const path = require('path');
const rootDir = require('../utils/pathUtil');
const fs = require('fs');


const favFilePath = path.join(rootDir, 'data', 'favorites.json');

module.exports = class Favorites {
    static addFavories(homeId, callback) {
        this.getFavorites((favHome) => {
            if (favHome.includes(homeId)) {
                const newFavHomes = favHome.filter(home => home !== homeId);
                fs.writeFile(favFilePath, JSON.stringify(newFavHomes), (error) => {
                    if (error) console.log("Error writing file:", error);
                    if (callback) {
                        callback();
                    }
                });
            } else {
                favHome.push(homeId);
                fs.writeFile(favFilePath, JSON.stringify(favHome), (error) => {
                    if (error) console.log("Error writing file:", error);
                    if (callback) {
                        callback();
                    }
                });
            }
        });
    }

    static getFavorites(callback) {
        fs.readFile(favFilePath, ((err, data) => {
            callback(!err ? JSON.parse(data) : [])
        }))
    }
}