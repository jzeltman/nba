import Init from './init';
import { getGamesForUser } from '../app/helpers';
import dict from '../dictionary';
import Logger from '../logger';
const Log = new Logger('Reducer > Index');

const initialState = {
    userPreferences : {
        gamesPerWeek : 3,
        teams : [],
        timezone : 'America/New_York',
        multiplier: 0,
        preference : 'best'
    },
    teams : dict.allTeams,
    schedule : [],
    games : [],
    gamesThisWeek : [],
    rankedGames : [],
    userGames : [],
    standings : []
};

export function updateSchedule(state){
    return { ...state, userGames : getGamesForUser(state) }
}

export default function Reducers(state = initialState, action) {

    let newState;

    switch (action.type) {
        case 'INITIAL_DATA':
            return Init(state,action);
            break;

        case 'TOGGLE_FAVORITE_TEAM':
            Log.log(['TOGGLE_FAVORITE_TEAM',state,action])
            newState = { ...state };
            // delete all existing teams
            newState.userPreferences.teams.splice(0,100);
            newState.teams = newState.teams.map( team => { 
                // flip favorite value if matched team
                if ( team.id === parseInt(action.id) ){ team.favorite = !team.favorite; }
                // add back team if it is now favorited
                if ( team.favorite ){ newState.userPreferences.teams.push(team.name) }
                return team;
            });
            return updateSchedule(newState);
            break;

        case 'CHANGE_GAMES_PER_WEEK':
            Log.log(['CHANGE_GAMES_PER_WEEK',state,action]);
            newState = { ...state };
            newState.userPreferences.gamesPerWeek = parseInt(action.value);
            return updateSchedule(newState);

        case 'CHANGE_GAME_QUALITY_PREFERENCE':
            Log.log(['CHANGE_GAME_QUALITY_PREFERENCE',state,action]);
            newState = { ...state };
            newState.userPreferences.preference = action.value
            switch( action.value ){
                case 'best':
                    newState.userPreferences.multiplier = 0;
                    break;

                case 'favorite':
                    newState.userPreferences.multiplier = 100;
                    break;

                case 'mix':
                default:
                    newState.userPreferences.multiplier = 3;
                    break;
            }

            return updateSchedule(newState);

        default:
            return state
            break;
    }

    Log.log('REDUCERS',state,action);
}
