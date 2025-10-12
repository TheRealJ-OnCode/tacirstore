const { healthController } = require("./health.controller");

const r = require("express").Router();
r.get("/health", healthController)



module.exports = r;