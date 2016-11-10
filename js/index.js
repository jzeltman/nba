import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import View from './views/index';
import Reducer from './reducers/index';

import GAMES from '../data/nba/2017/regular-season.json';
import STANDINGS from '../data/nba/2017/standings.json';

document.addEventListener('DOMContentLoaded',Init);

function Init(){
    const store = createStore(Reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && 
                                       window.__REDUX_DEVTOOLS_EXTENSION__());
    
    ReactDOM.render(
        <Provider store={store}><View /></Provider>,
        document.getElementById('app')
    );

    // eventually this will be an ajax call for current data
    store.dispatch({
        type: 'INITIAL_DATA',
        games : GAMES,
        standings : STANDINGS
    });
}
