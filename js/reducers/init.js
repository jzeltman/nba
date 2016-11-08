import { 
    parseStandings,
    getGamesByWeek,
    getGamesBetweenTopTeams
} from '../app/helpers';

export default function Init(state,action){
    console.log('Init',state,action);
    let newState = Object.assign({},state);
    newState.standings = parseStandings(action.standings); 
    newState.games = action.games;
    newState.gamesThisWeek = getGamesByWeek(action.games);
    let rankedGames = getGamesBetweenTopTeams( 
                               newState.gamesThisWeek, 
                               newState.standings.names,
                               state.userPreferences,
                               newState.standings
                            )
    newState.rankedGames = rankedGames;
    newState.userGames = rankedGames.slice(0,state.userPreferences.gamesPerWeek);
    return newState;
}
