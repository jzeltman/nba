import Moment from 'moment';

import DATA from '../../data/nba/2017/regular-season.json';
import STANDINGS from '../../data/nba/2017/standings.json';

import { 
    getGamesByWeek,
    getUserGames,
    parseStandings
} from './helpers';
import dict from '../dictionary.js';

export default class App {
    constructor(props){
        console.log('App',dict,props);

        this.gamesThisWeek = getGamesByWeek(DATA);
        this.userGamesThisWeek = getGamesByWeek(getUserGames(DATA,props.preferences));
        this.standings = parseStandings(STANDINGS,4);
    }
}
