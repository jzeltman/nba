import { 
    getUserGames,
    parseStandings,
    getGamesByWeek,
    getGamesBetweenTopTeams
} from '../app/helpers';

export function updateScheduleByGamesPerWeek(state,passedGames,passedStandings){
    let newState = Object.assign({},state);
    let userGames = getUserGames(newState.games,state.userPreferences);
        if ( userGames.length === 0 ){ userGames = newState.gamesThisWeek; }
    console.log('updateScheduleByFavoriteTeam',userGames);
    newState.rankedGames = getGamesByWeek(userGames);
    newState.userGames = newState.rankedGames.slice(0,state.userPreferences.gamesPerWeek);
    return newState;
}

export function updateScheduleByFavoriteTeam(state,passedGames,passedStandings){
    console.log('updateScheduleByFavoriteTeam',state);
    let newState = Object.assign({},state);
    let userGames = getUserGames(newState.games,state.userPreferences);
        if ( userGames.length === 0 ){ userGames = newState.gamesThisWeek; }
    newState.rankedGames = getGamesBetweenTopTeams( 
                               userGames,
                               newState.standings.names,
                               state.userPreferences,
                               newState.standings
                            );
    
    newState.userGames = newState.rankedGames.slice(0,state.userPreferences.gamesPerWeek);
    return newState;
}

export function updateSchedule(state,passedGames,passedStandings){
    console.log('updateSchedule',state);
    let newState = Object.assign({},state);
    newState.rankedGames = getGamesBetweenTopTeams( 
                               getGamesByWeek(newState.games),
                               newState.standings.names,
                               state.userPreferences,
                               newState.standings
                            );
    
    newState.userGames = newState.rankedGames.slice(0,state.userPreferences.gamesPerWeek);
    return newState;
}
