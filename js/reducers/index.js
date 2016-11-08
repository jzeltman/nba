import { 
    updateSchedule,
    updateScheduleByGamesPerWeek, 
    updateScheduleByFavoriteTeam 
} from './schedule';
import Init from './init';

import dict from '../dictionary';

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

export default function Reducers(state = initialState, action) {

    let newState;

    switch (action.type) {
        case 'INITIAL_DATA':
            return Init(state,action);
            break;

        case 'TOGGLE_FAVORITE_TEAM':
            console.log('TOGGLE_FAVORITE_TEAM',state.userPreferences.teams,action)
            newState = Object.assign({}, state);
            // delete all existing teams
            newState.userPreferences.teams.splice(0,100);
            newState.teams = newState.teams.map( team => { 
                console.log('teamid',team.id,action.id)
                if ( team.id === parseInt(action.id) ){ 
                    team.favorite = !team.favorite;
                }
                // add back team if it is now favorited
                if ( team.favorite ){ newState.userPreferences.teams.push(team.name) }
                return team;
            });
            console.log('newState.userPreferences.teams',newState.userPreferences.teams)
            return Object.assign({}, newState, updateSchedule(newState))
            break;

        case 'CHANGE_GAMES_PER_WEEK':
            newState = Object.assign({}, state);
            newState.userPreferences.gamesPerWeek = parseInt(action.value);
            return Object.assign({}, newState, updateSchedule(newState))

        case 'CHANGE_GAME_QUALITY_PREFERENCE':
            newState = Object.assign({}, state);
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

            return Object.assign({}, newState, updateSchedule(newState))

        default:
            return state
            break;
    }
}