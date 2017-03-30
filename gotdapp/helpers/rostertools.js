var express = require('express');

exports.textparse = function parsePlayers(roster) {
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


exports.score = function score(players, callback){
    getGames(players, callback);
}

function getGames(players, callback) {
    const Mlbgames = require('mlbgames');

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
    const options = {
        path: today
    };

    const mlbgames = new Mlbgames(options);

    var obj = [];
    mlbgames.get(function (err, games) {
        if (err || games == null) {
            return console.log(err);
        }
        else {
            for (var i = 0; i < games.length; i++) {
                var curr = {"home_team_abbrev": games[i].home_name_abbrev, "away_team_abbrev": games[i].away_name_abbrev, "time": games[i].time};
                obj.push(curr);
            }
            scoreGames(players, obj, callback);
        }
    });
}

function scoreGames(players, games, callback) {
    var scored = [];
    console.log(games);
    console.log("Here")
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
    callback(scored.sort(function compscore(a, b) {return b["score"] - a["score"];}));
}