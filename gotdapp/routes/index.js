var express = require('express');
var router = express.Router();
var tools = require('../helpers/rostertools');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fantasy Game Recommender' });
});

router.get('/games', function(req, res, next) {
  res.render('games', { title: 'Today\'s Games', home: "h", away: "a", score: 0 });
});

router.post('/games', function(req, res) {
    var roster = req.body.roster;
    var players = tools.textparse(roster);
    tools.score(players, function(games) {
        res.render('games', { title: 'Today\'s Games', home: games[0]["game"]["home_team_abbrev"], away: games[0]["game"]["away_team_abbrev"], score: games[0]["score"], time: games[0]["game"]["time"]});
    });
});

module.exports = router;
