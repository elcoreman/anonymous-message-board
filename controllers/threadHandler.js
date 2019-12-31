const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const DatabaseURI = process.env.DATABASE_URI;
const assert = require("chai").assert;
const DB = "test3";

function ThreadHandler() {
  this.threadList = (req, res) => {
    let board = req.params.board;
    MongoClient.connect(
      DatabaseURI,
      { useUnifiedTopology: true },
      (err, client) => {
        assert.equal(null, err);
        let col = client.db(DB).collection(board);
        col
          .find(
            {},
            {
              projection: {
                reported: 0,
                delete_password: 0,
                "replies.delete_password": 0,
                "replies.reported": 0
              }
            }
          )//
          .sort("bumped_on", -1)
          .limit(10)
          .toArray((err, docs) => {
            assert.equal(null, err);
            docs.forEach(doc => {
              doc.replycount = doc.replies.length;
              if (doc.replies.length > 3) doc.replies = doc.replies.slice(-3);
            });
            res.json(docs);
          });
      }
    );
  };
  this.newThreat = (req, res) => {
    let board = req.params.board;
    MongoClient.connect(
      DatabaseURI,
      { useUnifiedTopology: true },
      (err, client) => {
        assert.equal(null, err);
        let col = client.db(DB).collection(board);
        col.insertOne(
          {
            text: req.body.text,
            delete_password: req.body.delete_password,
            created_on: new Date(),
            bumped_on: new Date(),
            replies: [],
            reported: false
          },
          (err, doc) => {
            assert.equal(null, err);
            res.redirect("/b/" + board + "/");
          }
        );
      }
    );
  };
  this.reportThreat = (req, res) => {
    let board = req.params.board;
    MongoClient.connect(
      DatabaseURI,
      { useUnifiedTopology: true },
      (err, client) => {
        assert.equal(null, err);
        let col = client.db(DB).collection(board);
        col.findOneAndUpdate(
          {
            _id: new ObjectId(req.body.report_id)
          },
          { $set: { reported: true } },
          (err, doc) => {
            assert.equal(null, err);
            res.send("reported");
          }
        );
      }
    );
  };
  this.deleteThreat = (req, res) => {
    let board = req.params.board;
    MongoClient.connect(
      DatabaseURI,
      { useUnifiedTopology: true },
      (err, client) => {
        assert.equal(null, err);
        let col = client.db(DB).collection(board);
        col.findOneAndDelete(
          {
            _id: new ObjectId(req.body.thread_id),
            delete_password: req.body.delete_password
          },
          (err, doc) => {
            assert.equal(null, err);
            if (doc.value === null) res.send("incorrect password");
            else res.send("success");
          }
        );
      }
    );
  };
}

module.exports = ThreadHandler;
