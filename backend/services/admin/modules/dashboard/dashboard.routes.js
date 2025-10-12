const r = require("express").Router();
const { getDashboardStats } = require("./dashboard.controller");

r.get("/dashboard", getDashboardStats);

module.exports = r;