import { 
    parseStandings,
    getGamesForUser,
    getGamesByWeek,
    getGamesBetweenTopTeams
} from '../app/helpers';
import Logger from '../logger';
const Log = new Logger('Reducer > Init');

export default function Init(state,action){
    Log.log('Init',state,action);
    let gamesIterator = 0;
    let newState = { 
        ...state,
        standings : parseStandings(action.standings), 
        games : action.games.map( game => { 
            game.id = gamesIterator;
            gamesIterator++;
            return game;
        }),
        gamesThisWeek : getGamesByWeek(action.games)
    };
    let rankedGames = getGamesBetweenTopTeams( 
                               newState.gamesThisWeek, 
                               state.userPreferences,
                               newState.standings
                            )
    newState.rankedGames = rankedGames;
    newState.userGames = rankedGames.slice(0,state.userPreferences.gamesPerWeek);
    return newState;
}
