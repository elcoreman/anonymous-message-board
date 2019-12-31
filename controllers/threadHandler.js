const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const database_uri = process.env.DATABASE_URI;
const assert = require("chai").assert;

module.exports = () => {
  this.threadList = (req, res) => {
    MongoClient.connect(database_uri, (err, client) => {
      assert.equal(null, err);
      let col = client.db("test").collection("threads");
      col
        .find()
      .
        .sort("bumped_on", -1)
        .limit(10)
        .toArray((err, threads) => {
          assert.equal(null, err);
        });
    });
  };
  this.newThreat = (req, res) => {};
  this.reportThreat = (req, res) => {};
  this.deleteThreat = (req, res) => {};
};
