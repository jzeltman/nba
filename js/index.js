import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import View from './views/index';
import Reducer from './reducers/index';
import ParseRankings from './app/parse-rankings';

import GAMES from '../data/nba/2017/regular-season.json';
import STANDINGS from '../data/nba/2017/standings.json';
import radarGAMES from '../data/nba/2017/sportsradar-schedule.json';
import radarSTANDINGS from '../data/nba/2017/sportsradar-standings.json';
import radarRANKINGS from '../data/nba/2017/sportsradar-rankings.json';
import ParseGames from './app/parse-games';
var setupConferenceRankings = require('./app/parse-rankings');

document.addEventListener('DOMContentLoaded',Init);

function Init(){
    const store = createStore(Reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && 
                                       window.__REDUX_DEVTOOLS_EXTENSION__());
    //ParseRankings(radarRANKINGS)

    console.log('gamesThisWeek',ParseGames(radarGAMES.games, setupConferenceRankings(radarRANKINGS)));
    
    ReactDOM.render(
        <Provider store={store}><View /></Provider>,
        document.getElementById('app')
    );

    //console.log('radarGAMES,standings',radarGAMES,radarSTANDINGS,radarRANKINGS);

    // eventually this will be an ajax call for current data
    store.dispatch({
        type: 'INITIAL_DATA',
        games : GAMES,
        standings : STANDINGS
    });
}
