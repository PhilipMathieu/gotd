var express = require('express');
var router = express.Router()

function getGames() {
    return [{"home_team_abbrev":"CWS","away_team_abbrev":"BOS","time":"7:05 PM"}, {"home_team_abbrev":"PEM","away_team_abbrev":"NEM","time":"7:05 PM"}];
}

function parsePlayers(roster) {
    pattern = new RegExp(/[A-Z]{1}[a-z\.]{1}[A-z\.]+ [A-Z]{1}[a-z\.]{1}[A-z\.]+, [A-z]{3}/g);
    var players = roster.match(pattern);
    /* Remove breaking news */
    for (var i=players.length-1; i>=0; i--) {
        if (players[i] === "Breaking News") {
            players.splice(i, 1);
        }
        if (players[i] === "Recent News") {
            players.splice(i, 1);
        }
    }
    return players;
};

function scoreGames(players) {
    var games = getGames();
    var scored = [];
    for (var i=0; i<games.length; i++) {
        var curr = {"game":games[i],"score":0};
        for (var j=0; j<players.length; j++) {
            if(games[i]["home_team_abbrev"] == players[j].substr(players[j].length-3).toUpperCase()) {
                curr["score"] += 1;
            }
            if(games[i]["away_team_abbrev"] == players[j].substr(players[j].length-3).toUpperCase()) {
                curr["score"] += 1;
            }
        }
        scored.push(curr);
    }
    return scored.sort(function compscore(a, b) {return b["score"] - a["score"];});
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fantasy Game Recommender' });
});

router.get('/games', function(req, res, next) {
  res.render('games', { title: 'Today\'s Games', home: "h", away: "a", score: 0 });
});

router.post('/games', function(req, res) {
    var name = req.body.name;
        roster = req.body.roster;
    var players = parsePlayers(roster);
    var games = scoreGames(players);
    res.render('games', { title: 'Today\'s Games', home: games[0]["game"]["home_team_abbrev"], away: games[0]["game"]["away_team_abbrev"], score: games[0]["score"], time: games[0]["game"]["time"]});
});

module.exports = router;