var express = require('express');
var router = express.Router()

function getGames() {
    const Mlbgames = require('mlbgames');
    const mlbgames = new Mlbgames(options);

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var str = ""

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = 'year_' + yyyy + '/month_' + mm + '/day_' + dd + '/';
        console.log(today);
        const options = {
            path: today
        };

    mlbgames.get((err, games) => {
        for (var i = 0; i < games.length; i++) {

            if (i == 0) {
                str = '{"Games": [{"home_name_abbrev":"'+games[i].home_name_abbrev+'","away_name_abbrev":"'+games[i].away_name_abbrev+'","time":"'+games[i].time + '"}]}';
                var obj = JSON.parse(str);JSON
            }else{
                obj.Games.push('{"home_name_abbrev":"'+games[i].home_name_abbrev+'","away_name_abbrev":"'+games[i].away_name_abbrev+'","time":"'+games[i].time + '"}');
            }
        }

    });
    return obj;
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
