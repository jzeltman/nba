import React from 'react';
import { connect } from 'react-redux';

class Preferences extends React.Component {
    constructor(props){
        super(props);
        this.gamesPerWeekChangeHandler = this.gamesPerWeekChangeHandler.bind(this);
        this.gameQualityPreferenceChangeHandler = this.gameQualityPreferenceChangeHandler.bind(this);
        this.state = props;
    }

    gamesPerWeekChangeHandler(e){
        console.log('changeHandler',e,e.target.value);
        this.props.onChangeGamesPerWeek(e.target.value)
    }

    gameQualityPreferenceChangeHandler(e){
        console.log('changeHandler',e,e.target.value);
        this.props.onChangeGameQualityPreference(e.target.value)
    }

    render(){
        console.log('render Preferences',this.props)
        /*
                    <strong>Games Per Week ({this.state.preferences.gamesPerWeek})</strong>
                    */
        return <div id="preferences">
            <h3>Preferences</h3>
            <hr/>
            <ul>
                <li>
                    <strong>Games Per Week ({this.props.preferences.gamesPerWeek})</strong>
                    <span className="fl-right slider">
                        <span className="games-per-week_start">1</span>
                        <input type="range" 
                               min="1" 
                               max={this.props.totalGamesThisWeek}
                               defaultValue={this.state.preferences.gamesPerWeek}
                               onChange={this.gamesPerWeekChangeHandler}/>
                        <span className="games-per-week_end">{this.props.totalGamesThisWeek}</span>
                    </span>
                </li>
                <li>
                    <strong>Show Best Games</strong>
                    <select className='fl-right'
                            value='best'
                            onChange={this.gameQualityPreferenceChangeHandler}>
                        <option value='favorite'>Always Show My Teams</option>
                        <option value='best'>Prefer Best Matchups</option>
                        <option value='mix'>Mix</option>
                    </select>
                </li>
            </ul>
        </div>
    }
}

const mapStateToProps = (state,props) => {
    console.log('state',state);
    return {
        preferences : state.userPreferences,
        totalGamesThisWeek : state.gamesThisWeek.length
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onChangeGamesPerWeek: (value) => {
            dispatch({ type: 'CHANGE_GAMES_PER_WEEK', value })
        },
        onChangeGameQualityPreference: (value) => {
            dispatch({ type: 'CHANGE_GAME_QUALITY_PREFERENCE', value })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Preferences);
