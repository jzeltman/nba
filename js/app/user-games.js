var Moment   = require('moment');
var rankings = require('../../data/rankings.json')
var games    = require('../../data/games-this-week.json')

function getMultiplier(alias){
    var score, multiplier = 2;
    rankings.forEach( conference => { conference.ranks.forEach( team => {
        if ( team.alias === alias ){ score = team.rank; }
    }); });
    if ( score > 13 ){ return 13.5; }
    if ( score > 10 ){ return 10.5; }
    if ( score > 7 ) { return 7.5; }
    if ( score > 4 ) { return 4.5; }
    else { return 2; } 
}

module.exports = function gamesByUserPreferences(userPreferences){
    if ( userPreferences === undefined ){ return false; }
    // Do an early return if the user doesn't have favorite teams
    if ( !userPreferences.teams || userPreferences.teams.length === 0 ){ 
        return games.slice(0, userPreferences.gamesPerWeek);
    } else {
        
        var multiplier = 0;
        // if the user has selected to always show favorite teams, make the
        // multiplier very high to always put those games at the front
        if ( userPreferences.gameMix === 'favorite' ){ multiplier = 100; }
        if ( userPreferences.gameMix === 'mix' ){ multiplier = getMultiplier(userPreferences.teams); }
                                        
        // adjust game scores by user prefences and teams
        games = games.map( game => {
            if ( userPreferences.teams.indexOf(game.home.alias) !== -1 ||
                 userPreferences.teams.indexOf(game.away.alias) !== -1 ){
                game.gameScore -= multiplier;
            }
            return game;
        });

        // Sort games by game score
        games = games.sort( (a,b) => {
            if ( a.gameScore > b.gameScore ){ return 1; }
            if ( a.gameScore < b.gameScore ){ return -1; }
            else { return 0; }
        }).slice(0,userPreferences.gamesPerWeek)

        // sort games by date and return
        return games.sort( (a,b) => {
            if ( Moment(a.scheduled).isBefore(Moment(b.scheduled) ) ){ return -1; }
            if ( Moment(a.scheduled).isAfter(Moment(b.scheduled) ) ){ return 1; }
            else { return 0; }
        });
    }
}
