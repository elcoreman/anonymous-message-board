const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const database_uri = process.env.DATABASE_URI;
const assert = require("chai").assert;

module.exports = () => {
  this.threatList = (req, res) => {
    MongoClient.connect(database_uri, (err, client) => {
      assert.equal(null, err);
      let col = client.db("test").collection("threats");
      col.find();
    });
  };
  this.newThreat = (req, res) => {};
  this.reportThreat = (req, res) => {};
  this.deleteThreat = (req, res) => {};
};
