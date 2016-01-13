var express = require('express');
var router = express.Router();

<<<<<<< HEAD
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { });
=======
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
>>>>>>> 7a07e0506eb1aa0e46d8c74970f0863c217335f9
});

module.exports = router;
