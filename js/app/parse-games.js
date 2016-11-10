var Moment   = require('moment');
var dict     = require('../dictionary');
var Logger   = require('../logger');
var Log      = new Logger('Parse Games');

var Rankings, Games;

function getGamesByWeek(){
    return Games.filter( game => {
        var today    = Moment(new Date()).add(-1,'days');
        var thisWeek = Moment(new Date()).add(7,'days');
        var date     = game.scheduled
        return Moment(date).isAfter(today) && Moment(date).isBefore(thisWeek) && game.status !== 'closed';
    });
}

function getTeamRank(alias){
    if ( alias === undefined ){ return false; }
    var match;
    
    Rankings.forEach( conference => { conference.ranks.forEach( team => {
        if ( team.alias === alias ){ match = team; }
    }); });

    return match.rank;
}

function rankGames(passedGames){
    passedGames = passedGames.map( game => { 
        game.gameScore = getTeamRank(game.home.alias) + getTeamRank(game.away.alias);
        return game;
    });

    return passedGames.sort( (a,b) => {
        if ( a.gameScore > b.gameScore ){ return 1; }
        if ( a.gameScore < b.gameScore ){ return -1; }
        else { return 0; }
    });
}

module.exports = function ParseGames(games,rankings){
    if ( games === undefined ){ return false; }
    Games = games; Rankings = rankings;

    return rankGames( getGamesByWeek() );
    
}
