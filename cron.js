var rankings = require('./data/nba/2017/sportsradar-rankings.json')
var games = require('./data/nba/2017/sportsradar-schedule.json')

var setupConferenceRankings = require('./js/app/parse-rankings');
var saveJSON = require('./js/node/save-json');
var parseGames = require('./js/app/parse-games');
var getUserGames = require('./js/app/user-games');

var rankings = setupConferenceRankings(rankings);
var userPreferences = {
    gamesPerWeek : 5,
    //teams : [],
    //teams : 'CLE',
    //teams : 'WAS',
    teams : 'MIL',
    gameMix : 'mix'
}

saveJSON('rankings.json',rankings);
saveJSON('games-this-week.json',parseGames(games.games,rankings));
saveJSON('user-games-this-week.json',getUserGames(userPreferences));
