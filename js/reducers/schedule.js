import { getGamesForUser } from '../app/helpers';

export function updateSchedule(state,passedGames,passedStandings){
    let newState = { ...state }
    newState.userGames = getGamesForUser(newState);
    return newState;
}
