'use strict';

const ThreatHandler = require('../controllers/threatHandler.js');
const ReplyHandler = require('../controllers/replyHandler.js');

module.exports = function (app) {
  let threatHandler = new ThreatHandler();
  let replyHandler = new ReplyHandler();
  
  app.route('/api/threads/:board');
    
  app.route('/api/replies/:board');

};
