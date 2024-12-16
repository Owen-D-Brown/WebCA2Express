var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/createAccount', function(req, res, next) {
  res.render('createAccount');
});

module.exports = router;