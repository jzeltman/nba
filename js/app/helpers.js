import Moment from 'moment';

import DATA from '../../data/nba/2017/regular-season.json';
import STANDINGS from '../../data/nba/2017/standings.json';
import dict from '../dictionary.js';
import Logger from '../logger';
const Log = new Logger('App > Helpers');

export function getMonth(month){
    if ( typeof month === 'string' ){ return dict.months[month]; }
}

export function getHours(hours){
    let pm = hours.split(' ')[1].indexOf('pm') !== -1;
    let time = hours.split(':');
    let hour = pm ? parseInt(time[0]) + 12 : parseInt(time[0]);
    let minutes = parseInt(time[1]);
    let timeString = '' + hour + '-' + minutes;
    if ( timeString.length === 3 ){ timeString += '0'; }
    return timeString;
}

export function getUserGames(games,userPreferences){
    console.log('getUserGames',games,userPreferences)
    return games.filter( game => {
        return userPreferences.teams.indexOf(game[dict.home]) !== -1 ||
               userPreferences.teams.indexOf(game[dict.visitor]) !== -1;
    });
}

export function getGamesByWeek(games, week){
    return games.filter( game => {
        let today = Moment(new Date()).add(-1,'days');
        let thisWeek = Moment(new Date()).add(7,'days');
        let parseDate = game.Date.split(' ');
        let date = [parseDate[3], 
                    getMonth(parseDate[1]), 
                    parseDate[2], 
                    getHours(game['Start (ET)']) 
                   ].join('-');

        return Moment(date).isAfter(today) && Moment(date).isBefore(thisWeek);
    });
}

export function mapTeamDataToNames(teams){
    return teams.map( team => { return dict.teams[team[5]]; });
}

export function parseStandings(data,count = 4){
    console.log('parseStandings',data)
    let ecs = data.resultSets[4].rowSet.slice(0,count);
    let wcs = data.resultSets[5].rowSet.slice(0,count);
    let topTeams = [];
        ecs.map( team => { topTeams.push(team); })
        wcs.map( team => { topTeams.push(team); })
    let names = mapTeamDataToNames(topTeams);

    let eConferenceStandings = mapTeamDataToNames(data.resultSets[4].rowSet);
    let wConferenceStandings = mapTeamDataToNames(data.resultSets[5].rowSet);

    return { 
        topTeams, 
        names, 
        eConferenceStandings,
        wConferenceStandings 
    };
}

export function getTeamConference(team){
    if ( dict.eConference.indexOf(team) !== -1 ){ return 'Eastern'; }
    else { return 'Western'; }
}

export function getTeamConferenceRanking(team, standings){
    let conference = getTeamConference(team);
    let normalRank = 15;
    if ( conference === 'Eastern' ){ normalRank = standings.eConferenceStandings.indexOf(team) } 
    else { normalRank = standings.wConferenceStandings.indexOf(team) }
/*
    if ( getIsUserTeamsPlaying(team,standings) ){
        if ( normalRank > 10 ){ normalRank -= 10; }
        if ( normalRank > 5 ){ normalRank -= 5; }
    }
*/
    return normalRank;
}

export function getIsUserTeamsPlaying(game,teams){
    console.log('getIsUserTeamsPlaying',game,teams);
    if ( typeof game === 'string' ){ 
        if ( teams.indexOf(game) !== -1 ){ return true; }
        else { return false; }
    } else { 
        if ( teams.indexOf(game[dict.home]) !== -1 || teams.indexOf(game[dict.visitor]) !== -1 ){
            return true;
        } else { return false; }
    }
}

export function getGameQualityScore(game, userPreferences, standings){
    console.log('getGameQualityScore',game,userPreferences,standings);
    let userTeamPlaying = getIsUserTeamsPlaying(game,userPreferences.teams);
    let homeTeamScore = getTeamConferenceRanking(game[dict.home],standings);
    let visitorTeamScore = getTeamConferenceRanking(game[dict.visitor],standings);
    let score = homeTeamScore + visitorTeamScore;
    let userMultiplier = 0;
    let multiplier = userMultiplier;
    game.homeTeamScore = homeTeamScore;
    game.visitorTeamScore = visitorTeamScore;

    if ( userTeamPlaying ){
        // the decimal point is to prevent ties with other games
        if ( score > 25 ){ multiplier = userPreferences.multiplier * 5.5; }
        if ( score > 20 ){ multiplier = userPreferences.multiplier * 4.5; }
        if ( score > 15 ){ multiplier = userPreferences.multiplier * 3.5; }
        if ( score > 10 ){ multiplier = userPreferences.multiplier * 2.5; }
        else { multiplier = userPreferences.multiplier; }
    } 
    game.normalGameScore = score;
    game.multiplierScore = multiplier;

    return score - multiplier;
}

export function getGamesBetweenTopTeams(games,userPreferences,standings){
    console.log('getGamesBetweenTopTeams',games,userPreferences,standings);
    let gamesArray = games.map( game => {
        game.gameScore = getGameQualityScore(game,userPreferences,standings)
        return game;
    });

    return gamesArray.sort( ( a,b ) => {
        if ( a.gameScore > b.gameScore ){ return 1; }
        if ( a.gameScore < b.gameScore ){ return -1; }
        else { return 0; }
    });
}

export function getGamesForUser( state ){
    Log.log(['getGamesForUser',state])
    if ( state === undefined ){ return false; }
    let games = state.gamesThisWeek;
    let standings = state.standings;
    let user = state.userPreferences;
    let favoriteGames = [], userGames = [];
    Log.log(['getGamesForUser > games, standings, user',games,standings,user])
    
    // move all the user games to the front of the list, and remove them from
    // the games list so other games can be ranked independently
    if ( user.preference === 'favorite' ){
        Log.log(['getGamesForUser > get favorite team games',user.teams])
        games.forEach( (game,i) => {
            Log.log(['getGamesForUser > favorite team loop',game]);
            if ( user.teams.indexOf(game[dict.home]) !== -1 ||
                   user.teams.indexOf(game[dict.visitor]) !== -1 ){
        Log.log(['getGamesForUser > add to favorite games',game])
                favoriteGames.push(game);
                games.splice(i,1);
            };
        });
        Log.log(['getGamesForUser > favorite team games',favoriteGames])
    }

    userGames = getGamesBetweenTopTeams(games,user,standings);
    Log.log(['getGamesForUser > games for user',userGames])
    if ( user.preference === 'favorite' ){
        userGames = favoriteGames.concat(userGames);
    }
    console.log('userGames',userGames);
    return userGames.slice(0,user.gamesPerWeek);

}

/*
let gamesThisWeek = getGamesByWeek(DATA);
let userGamesThisWeek = getGamesByWeek(getUserGames(DATA));
let standings = parseStandings(STANDINGS,4);
let goodGamesThisWeek = getGamesBetweenTopTeams(getGamesByWeek(DATA),standings.names).slice(0,userPreferences.gamesPerWeek)
let rankAllGamesThisWeek = getGamesBetweenTopTeams(getGamesByWeek(DATA),standings.names)


console.log('DATA',DATA,'STANDINGS',STANDINGS)
console.log('ECS',eConferenceStandings,'WCS',wConferenceStandings)
console.log('standings',standings);
console.log('gamesThisWeek',gamesThisWeek);
console.log('userGamesThisWeek',userGamesThisWeek);
console.log('goodGamesThisWeek',goodGamesThisWeek);
console.log('rankAllGamesThisWeek',rankAllGamesThisWeek);
*/
