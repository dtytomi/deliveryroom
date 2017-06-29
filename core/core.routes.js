'use strict';

function core (app) {
  // body...
  app.get("/", function(req, res) {
    res.json({message: "Express is up!"});
  });

}

module.exports = core;