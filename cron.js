var rankings = require('./data/nba/2017/sportsradar-rankings.json')
var games = require('./data/nba/2017/sportsradar-schedule.json')

var setupConferenceRankings = require('./js/app/parse-rankings');
var saveJSON = require('./js/node/save-json');
var parseGames = require('./js/app/parse-games');

var rankings = setupConferenceRankings(rankings);

saveJSON('rankings.json',rankings);
saveJSON('games-this-week.json',parseGames(games.games,rankings));
