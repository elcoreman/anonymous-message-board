var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

let id1, id2, id3;

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("create new threads", done => {
        chai
          .request(server)
          .post("/api/threads/test")
          .send({ text: "text", delete_password: "pass" })
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
          });
        chai
          .request(server)
          .post("/api/threads/test")
          .send({ text: "text2", delete_password: "pass2" })
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {
      test("get specific thread", done => {
        chai
          .request(server)
          .get("/api/threads/test")
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "bumped_on");
            assert.property(res.body[0], "replies");
            assert.notProperty(res.body[0], "reported");
            assert.notProperty(res.body[0], "delete_password");
            assert.isArray(res.body[0].replies);
            assert.isBelow(res.body[0].replies.length, 4);
            id1 = res.body[0]._id;
            id2 = res.body[1]._id;
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("delete thread with valid password", done => {
        chai
          .request(server)
          .delete("/api/threads/test")
          .send({ thread_id: id1, delete_password: "pass" })
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });

      test("delete thread with bad password", done => {
        chai
          .request(server)
          .delete("/api/threads/test")
          .send({ thread_id: id2, delete_password: "bad-pass" })
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          });
      });
    });

    suite("PUT", function() {
      test("report thread", done => {
        chai
          .request(server)
          .put("/api/threads/test")
          .send({ report_id: id2 })
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.equal(res.text, "reported");
            done();
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      test("reply to thread", done => {
        chai
          .request(server)
          .post("/api/replies/test")
          .send({
            thread_id: id2,
            text: "text3",
            delete_password: "pass3"
          })
          .end(function(err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {
      test("get replies of thread", done => {
        chai
          .request(server)
          .get("/api/replies/test")
          .query({ thread_id: id2 })
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.property(res.body, "_id");
            assert.property(res.body, "text");
            assert.property(res.body, "created_on");
            assert.property(res.body, "bumped_on");
            assert.property(res.body, "replies");
            assert.notProperty(res.body, "delete_password");
            assert.notProperty(res.body, "reported");
            assert.isArray(res.body.replies);
            assert.notProperty(res.body.replies[0], "delete_password");
            assert.notProperty(res.body.replies[0], "reported");
            assert.equal(
              res.body.replies[res.body.replies.length - 1].text,
              "text3"
            );
            id3 = res.body.replies[0]._id;
            done();
          });
      });
    });

    suite("PUT", function() {
      test("report reply", done => {
        chai
          .request(server)
          .put("/api/threads/test")
          .send({ thread_id: id2, reply_id: id3 })
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.equal(res.text, "reported");
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("delete reply with bad password", done => {
        chai
          .request(server)
          .delete("/api/threads/test")
          .send({
            thread_id: id2,
            reply_id: id3,
            delete_password: "bad-pass"
          })
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          });
      });

      test("delete reply with valid password", done => {
        chai
          .request(server)
          .delete("/api/threads/test")
          .send({
            thread_id: id2,
            reply_id: id3,
            delete_password: "pass3"
          })
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });
  });
});
