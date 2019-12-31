var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("create new thread", done => {
        chai
          .request(server)
          .post("/api/threads/myTest")
          .send({ text: "myText", delete_password: "pass" })
          .end(function(err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 200);
          });
      });
    });

    suite("GET", function() {
      test("most recent 10 threads with most recent 3 replies each", (done)=> {
        chai
          .request(server)
          .get("/api/threads/myTest")
          .end(function(err, res) {
          assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "bumped_on");
            assert.property(res.body[0], "text");
            assert.property(res.body[0], "replies");
            assert.notProperty(res.body[0], "reported");
            assert.notProperty(res.body[0], "delete_password");
            assert.isArray(res.body[0].replies);
            assert.isBelow(res.body[0].replies.length, 4);
            testId = res.body[0]._id;
            testId2 = res.body[1]._id;
            done();
          });
      });
    });

    suite("DELETE", function() {});

    suite("PUT", function() {});
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {});

    suite("GET", function() {});

    suite("PUT", function() {});

    suite("DELETE", function() {});
  });
});
