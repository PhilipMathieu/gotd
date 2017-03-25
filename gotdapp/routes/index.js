var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Game of the Day' });
});

router.get('/games', function(req, res, next) {
  res.render('games', { title: 'Today\'s Games' });
});

router.post('/games', function(req, res) {
    var name = req.body.name;
        roster = req.body.roster;
    res.render('games', { title: 'Today\'s Games' });
});

module.exports = router;