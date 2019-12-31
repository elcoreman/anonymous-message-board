var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

let id1, id2;

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("create new threads", done => {
        chai
          .request(server)
          .post("/api/threads/myTest")
          .send({ text: "myText", delete_password: "myPass" })
          .end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);
          });
        chai
          .request(server)
          .post("/api/threads/myTest")
          .send({ text: "myText2", delete_password: "myPass2" })
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
          .get("/api/threads/myTest")
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
      test("delete thread with good password", done => {
        chai
          .request(server)
          .delete("/api/threads/myTest")
          .send({ thread_id: id1, delete_password: "myPass" })
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
          .delete("/api/threads/myTest")
          .send({ thread_id: id2, delete_password: "badPass" })
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
          .put("/api/threads/myTest")
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
      test("reply to thread", function(done) {
        chai
          .request(server)
          .post("/api/replies/fcc")
          .send({
            thread_id: testId2,
            text: "a reply" + testText,
            delete_password: "pass"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {});

    suite("PUT", function() {});

    suite("DELETE", function() {});
  });
});
