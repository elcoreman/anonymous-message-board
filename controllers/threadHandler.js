const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const DatabaseURI = process.env.DATABASE_URI;
const assert = require("chai").assert;

module.exports = () => {
  this.threadList = (req, res) => {
    let board = req.params.board;
    MongoClient.connect(DatabaseURI, (err, client) => {
      assert.equal(null, err);
      let col = client.db("test").collection(board);
      col
        .find(
          {},
          {
            projection: {
              reported: 0,
              delete_passwords: 0,
              "replies.delete_password": 0,
              "replies.reported": 0
            }
          }
        )
        .sort("bumped_on", -1)
        .limit(10)
        .toArray((err, threads) => {
          assert.equal(null, err);
          threads.forEach(thread => {
            thread.replycount = thread.replies.length;
            if (thread.replies.length > 3)
              thread.replies = thread.replies.slice(-3);
          });
          res.json(threads);
        });
    });
  };
  this.newThreat = (req, res) => {
    let board = req.params.board;
    let text = req.body.text;
    let delete_password = req.body.delete_password;
    MongoClient.connect(DatabaseURI, (err, client) => {
      assert.equal(null, err);
      let col = client.db("test").collection(board);
      col.insertOne(
        {
          text,
          delete_password,
          created_on: new Date(),
          bumped_on: new Date(),
          replies: [],
          reported: false
        },
        (err, thread) => {
          assert.equal(null, err);
          res.redirect("/b/" + board);
        }
      );
    });
  };
  this.reportThreat = (req, res) => {
    let board = req.params.board;
  };
  this.deleteThreat = (req, res) => {
    let board = req.params.board;
  };
};
