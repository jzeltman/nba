import React from 'react';
import { connect } from 'react-redux';

import TeamPicker from './team-picker';
import Preferences from './preferences';
import GamesPerWeek from './games-per-week';
import Schedule from './schedule';

class View extends React.Component {
    render(){
        return <div>
            <header>
                <h1>
                    <img src='http://stats.nba.com/media/img/NBA_logo.svg' />
                    <span>NBA Scheduler</span>
                </h1>
            </header>
            <main>
                <aside><Schedule /></aside>
                <aside>
                    <ul>
                        <GamesPerWeek />
                        <Preferences />
                    </ul>
                </aside>
                <aside><TeamPicker /></aside>
            </main>
        </div>
    }
}

export default connect()(View);
