const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;
const MONGO_URL = "mongodb+srv://eedainbhat:SWIFTT_EDN*@swifttedn.3hc8tyq.mongodb.net/?appName=Swifttedn";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL)
    .then(client => {
      callback(client);
      _db = client.db("airbnb");
    }).catch(error => {
      console.error('Error connecting to MongoDB:', error);
    });
};

const getDb  = ()=>{
  if(!_db) {
    throw new Error("Database not conneced");
  } 
  return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;