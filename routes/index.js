var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // console.log(req.session);

  if (req.session.role) {
    return res.redirect("/" + req.session.role);
  }

  return res.render("index");
});

module.exports = router;
