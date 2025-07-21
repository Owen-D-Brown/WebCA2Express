var express = require('express');
var router = express.Router();

/* DEV NOTE: this page and feature is under construction. It was off-topic for the brief and I decided to postpone it until after the submission when I'm flashing things out to make this a portfolio piece. */
router.get('/createAccount', function(req, res, next) {
  res.render('createAccount');
});

router.get('/', function(req, res, next) {
  res.render('createAccount');
});

router.post('/createAccount', (req, res) => {
  console.log("Form data received:", req.body);
  res.send("Account data logged to server");
});

module.exports = router;