var express = require("express");
var router = express.Router();

const { getConflicts } = require("../controllers/Conflict.controller");

router.get("/", getConflicts);

module.exports = router;
