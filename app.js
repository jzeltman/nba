/*
var express = require('express')
var app = express()
*/
var rankings = require('./data/nba/2017/sportsradar-rankings.json')
var games = require('./data/nba/2017/sportsradar-schedule.json')

var setupConferenceRankings = require('./js/app/parse-rankings');
var saveJSON = require('./js/node/save-json');
var parseGames = require('./js/app/parse-games');

saveJSON('rankings.json',setupConferenceRankings(rankings));
parseGames(games);

/*
app.use('/', express.static(__dirname + '/public'));
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
*/
