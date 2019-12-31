"use strict";

const ThreadHandler = require("../controllers/threadHandler.js");
const ReplyHandler = require("../controllers/replyHandler.js");

module.exports = function(app) {
  let threadHandler = new ThreadHandler();
  let replyHandler = new ReplyHandler();

  app
    .route("/api/threads/:board")
    .get(threadHandler.threadList)
    .post(threadHandler.newThreat)
    .put(threadHandler.reportThreat)
    .delete(threadHandler.deleteThreat);

  app
    .route("/api/replies/:board")
    .get(replyHandler.replyList)
    .post(replyHandler.newReply)
    .put(replyHandler.reportReply)
    .delete(replyHandler.deleteReply);
};