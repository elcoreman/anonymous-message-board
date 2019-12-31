const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const DatabaseURI = process.env.DATABASE_URI;
const assert = require("chai").assert;
const DB = "test3";

function ReplyHandler() {
  this.replyList = (req, res) => {
    let board = req.params.board;
    MongoClient.connect(DatabaseURI, (err, client) => {
      assert.equal(null, err);
      let col = client.db(DB).collection(board);
      col
        .find(
          { _id: new ObjectId(req.query.thread_id) },
          {
            projection: {
              reported: 0,
              delete_passwords: 0,
              "replies.delete_password": 0,
              "replies.reported": 0
            }
          }
        )
        .toArray((err, docs) => {
          assert.equal(null, err);
          res.json(docs[0]);
        });
    });
  };
  this.newReply = (req, res) => {
    let board = req.params.board;
    MongoClient.connect(DatabaseURI, (err, client) => {
      assert.equal(null, err);
      let col = client.db(DB).collection(board);
      col.findOneAndUpdate(
        {
          _id: new ObjectId(req.body.thread_id)
        },
        {
          $set: { bumped_on: new Date() },
          $push: {
            replies: {
              text: req.body.text,
              created_on: new Date(),
              reported: false,
              delete_password: req.body.delete_password
            }
          }
        },
        (err, doc) => {
          assert.equal(null, err);
          res.redirect("/b/" + board + "/" + req.body.thread_id);
        }
      );
    });
  };
  this.reportReply = (req, res) => {
    let board = req.params.board;
    MongoClient.connect(DatabaseURI, (err, client) => {
      assert.equal(null, err);
      let col = client.db(DB).collection(board);
      col.findOneAndUpdate(
        {
          _id: new ObjectId(req.body.thread_id),
          "replies._id": new ObjectId(req.body.reply_id)
        },
        { $set: { "replies.$.reported": true } },
        (err, doc) => {
          assert.equal(null, err);
          res.send("reported");
        }
      );
    });
  };
  this.deleteReply = (req, res) => {
    let board = req.params.board;
    MongoClient.connect(DatabaseURI, (err, client) => {
      assert.equal(null, err);
      let col = client.db(DB).collection(board);
      col.findOneAndUpdate(
        {
          _id: new ObjectId(req.body.thread_id),
          replies: {
            $elemMatch: {
              _id: new ObjectId(req.body.reply_id),
              delete_password: req.body.delete_password
            }
          }
        },
        {
          $set: { "replies.$.text": "[deleted]" }
        },
        (err, doc) => {
          assert.equal(null, err);
          if (doc.value === null) res.send("incorrect password");
          else res.send("success");
        }
      );
    });
  };
}

module.exports = ReplyHandler;
